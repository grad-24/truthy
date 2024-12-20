import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/entity/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CommonSearchFieldDto } from 'src/common/extra/common-search-field.dto';
import JwtTwoFactorGuard from 'src/common/guard/jwt-two-factor.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Pagination } from 'src/paginate';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { OrderSerializer } from './serializer/order.serializer';

@UseGuards(JwtTwoFactorGuard, PermissionGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(
    @GetUser() currentAdmin: UserEntity,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<OrderSerializer> {
    return this.ordersService.create(currentAdmin, createOrderDto);
  }

  @Get()
  async findAll(
    @Query()
    filter: CommonSearchFieldDto,
    @GetUser()
    currentUser: UserEntity
  ): Promise<Pagination<OrderSerializer>> {
    console.log(filter)
    const o = await this.ordersService.findAll(currentUser, filter);
    console.log(o.totalItems)
    return o;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: UserEntity) {
    return this.ordersService.findOne(id, currentUser);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto, @GetUser() currentUser: UserEntity) {
    return this.ordersService.update(id, updateOrderDto, currentUser);
  }

  @Patch(':id/status/in-progress')
  async markAsInProgress(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: UserEntity) {
    return this.ordersService.updateStatusInProgress(id, currentUser);
  }

  @Patch(':id/status/done')
  async markAsDone(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: UserEntity) {
    return this.ordersService.updateStatusDone(id, currentUser);
  }

  @Patch(':id/status/cancelled')
  async markAsCancelled(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() currentUser: UserEntity
  ) {
    return this.ordersService.updateStatusCancelled(id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: UserEntity) {
    return this.ordersService.remove(id, currentUser);
  }
}
