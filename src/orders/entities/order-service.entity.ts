import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ServiceEntity } from 'src/services/entities/service.entity';

@Entity('order_service')
export class OrderToServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, (order) => order.orderToService)
    order: OrderEntity;

    @ManyToOne(() => ServiceEntity, (service) => service.orderToService)
    service: ServiceEntity;

    @Column('int')
    quantity: number;

    @Column('float')
    price_at_ordering: number;
}
