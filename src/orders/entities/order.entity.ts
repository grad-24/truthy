import { CustomerEntity } from 'src/auth/entity/user.entity';
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { ServiceEntity } from 'src/services/entities/service.entity';
import { TechnicianTeamEntity } from 'src/technician-teams/entities/technician-team.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { OrderToServiceEntity } from './order-service.entity';

export enum OrderStatusEnum {
    TODO = 'to-do',
    IN_PROGRESS = 'in-progress',
    DONE = 'done',
    CANCELLED = 'cancelled',
}

export enum OrderPriorityEnum {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

@Entity({ name: 'orders' })
export class OrderEntity extends CustomBaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.TODO,
    })
    status: OrderStatusEnum;

    @Column({
        type: 'enum',
        enum: OrderPriorityEnum,
        default: OrderPriorityEnum.MEDIUM,
    })
    priority: OrderPriorityEnum;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column('decimal')
    total_cost: number;

    @Column()
    location_address: string;

    @Column({ type: 'decimal', nullable: true })
    location_latitude?: number;

    @Column({ type: 'decimal', nullable: true })
    location_longitude?: number;

    @ManyToOne(() => TechnicianTeamEntity, team => team.orders)
    team: TechnicianTeamEntity;

    @Column()
    teamId: number;

    @ManyToOne(() => CustomerEntity, user => user.orders)
    customer: CustomerEntity;

    @OneToMany(() => OrderToServiceEntity, (orderToService) => orderToService.order) // be careful of this, populate will not work if you miss this up
    orderToService: OrderToServiceEntity[];

    @Column()
    customerId: number;

    @Column()
    created_by: string;

    @Column({ nullable: true })
    modified_by?: string;
}
