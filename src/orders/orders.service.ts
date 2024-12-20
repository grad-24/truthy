import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { TechnicianEntity, UserEntity } from 'src/auth/entity/user.entity';
import { CommonDtoInterface } from 'src/common/interfaces/common-dto.interface';
import { CustomHttpException } from 'src/exception/custom-http.exception';
import { MailJobInterface } from 'src/mail/interface/mail-job.interface';
import { MailService } from 'src/mail/mail.service';
import { Pagination } from 'src/paginate';
import { TechnicianTeamsService } from 'src/technician-teams/technician-teams.service';
import { DeepPartial, Repository } from 'typeorm';
import { OrderEntity, OrderStatusEnum } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { OrderSerializer } from './serializer/order.serializer';
import { ServicesService } from 'src/services/services.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderToServiceEntity } from './entities/order-service.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    private readonly repository: OrderRepository,
    private readonly authService: AuthService,
    private readonly servicesService: ServicesService,
    private readonly technicianTeamService: TechnicianTeamsService,
    private readonly mailService: MailService,
    @InjectRepository(OrderToServiceEntity)
    private readonly orderServiceRepository: Repository<OrderToServiceEntity>,
  ) { }

  async create(currentAdmin: UserEntity, createOrderDto: CreateOrderDto): Promise<OrderSerializer> {
    // check for the customer and team, will fail if not found
    // const customer = await this.authService.findCustomerById(createOrderDto.customerId);
    const team = await this.technicianTeamService.findById(createOrderDto.teamId);

    const orderStartDate = new Date(createOrderDto.start_date as string);
    const orderEndDate = new Date(createOrderDto.end_date as string);

    const orderStart = orderStartDate.getTime();
    const orderEnd = orderEndDate.getTime();

    // Check if order date conflicts with the team's busy times
    const hasBusyTimeConflict = team.busyTimes.some(busyTime => {
      const busyStart = new Date(busyTime.start_date).getTime();
      const busyEnd = new Date(busyTime.end_date).getTime();

      // Check if the order time overlaps with any busy time
      return (orderStart < busyEnd && orderEnd > busyStart);
    });

    if (hasBusyTimeConflict)
      throw new CustomHttpException('The selected time conflicts with the team\'s schedule.');

    // Check for conflicts with daily breaks
    const startHour = orderStartDate.toISOString().split('T')[1].slice(0, 5);
    const endHour = orderEndDate.toISOString().split('T')[1].slice(0, 5);

    const hasBreakTimeConflict = team.dailyBreaks.some(breakTime =>
      (startHour < breakTime.end_hour && endHour > breakTime.start_hour)
    );

    if (hasBreakTimeConflict) {
      throw new CustomHttpException('The selected time conflicts with the team\'s break time.');
    }

    const services = await this.getServicesByIds(createOrderDto.services);
    delete createOrderDto.services;

    const order = await this.repository.createEntity({
      ...createOrderDto,
      status: OrderStatusEnum.TODO,
      created_by: currentAdmin.username
    });

    services.forEach(async service => {
      const orderService = this.orderServiceRepository.create({
        price_at_ordering: service.price,
        quantity: 1,
        service,
        order: await this.repository.findOne(order.id)
      })
      await this.orderServiceRepository.save(orderService);
    })

    const newBusyTimes = [...team.busyTimes, {
      start_date: orderStartDate,
      end_date: orderEndDate,
      order_id: order.id
    }];
    await this.technicianTeamService.update(team.id, { busyTimes: newBusyTimes });

    return order;
  }

  /**
* Get Services array
* @param ids
*/
  async getServicesByIds(ids: number[]) {
    if (ids && ids.length > 0) {
      return await this.servicesService.whereInIds(ids);
    }
    return [];
  }

  findAll(currentUser: UserEntity, filter: CommonDtoInterface): Promise<Pagination<OrderSerializer>> {
    let extraConditions: Record<string, any> = {};
    // if the current user is a customer and not an admin, add additional constraints
    if (currentUser.roleId === 2) extraConditions = { customerId: currentUser.id };
    if (currentUser.roleId === 4) extraConditions = { teamId: (currentUser as TechnicianEntity).teamId };

    return this.repository.paginate(filter, [],
      [
        "name",
        "description",
        // "status",
        // "priority",
      ],
      undefined,
      extraConditions);
  }

  findOne(id: number, currentUser: UserEntity): Promise<OrderSerializer> {
    let extraConditions: Record<string, any> = {};
    // if the current user is a (customer or technician) and not an admin, add additional constraints
    if (currentUser?.roleId === 2) extraConditions = { customerId: currentUser.id };
    if (currentUser?.roleId === 4) extraConditions = { teamId: (currentUser as TechnicianEntity).teamId };

    return this.repository.get(id, ["team", "customer", "orderToService", "orderToService.service"], undefined, extraConditions);
  }

  async update(id: number, inputDto: DeepPartial<OrderEntity>, currentUser?: UserEntity): Promise<OrderSerializer> {
    const order = await this.findOne(id, currentUser);
    return this.repository.updateEntity(order, inputDto, ["team", "customer"]);
  }

  async remove(id: number, currentUser: UserEntity): Promise<void> {
    await this.findOne(id, currentUser);
    this.repository.delete({ id });
  }

  async updateStatusInProgress(orderId: number, currentUser: UserEntity) {
    let order = await this.findOne(orderId, currentUser);
    if (order.status !== OrderStatusEnum.TODO)
      throw new CustomHttpException(
        `Cannot mark order as "IN-PROGRESS" because its current status is "${order.status.toUpperCase()}". Only orders that are "To Do" can be marked as "In Progress".`
      );
    return await this.update(orderId, { status: OrderStatusEnum.IN_PROGRESS });
  }

  async updateStatusDone(orderId: number, currentUser: UserEntity) {
    let order = await this.findOne(orderId, currentUser);
    if (order.status !== OrderStatusEnum.IN_PROGRESS)
      throw new CustomHttpException(
        `Cannot mark order as "DONE" because its current status is "${order.status.toUpperCase()}". Only orders that are "In Progress" can be marked as "Done".`
      );
    order = await this.update(orderId, { status: OrderStatusEnum.DONE });

    // Free up the busy time in the team
    await this.technicianTeamService.removeBusyTime(order.team.id, order.id);

    // Notify the customer
    this.sendOrderEmail(order);

    return order;
  }

  async updateStatusCancelled(orderId: number, currentUser: UserEntity) {
    let order = await this.findOne(orderId, currentUser);

    if (order.status !== OrderStatusEnum.TODO) {
      throw new CustomHttpException(
        `Cannot mark order as "CANCELLED" because its current status is "${order.status.toUpperCase()}". Only orders that are "TODO" can be marked as "CANCELLED".`
      );
    }

    order = await this.update(orderId, { status: OrderStatusEnum.CANCELLED });

    // Free up the busy time in the team
    await this.technicianTeamService.removeBusyTime(order.team.id, order.id);

    // Notify the customer
    this.sendOrderEmail(order);

    return order;
  }

  async sendOrderEmail(order: OrderSerializer) {
    const subject = order.status === OrderStatusEnum.DONE ? "Order Completed" : "Order Cancelled";
    const mailData: MailJobInterface = {
      to: order.customer.email,
      subject,
      slug: order.status === OrderStatusEnum.DONE ? "order-completed" : "order-cancelled",
      context: {
        username: order.customer.username,
        subject
      }
    };
    this.mailService.sendMail(mailData, 'system-mail');
  }
}
