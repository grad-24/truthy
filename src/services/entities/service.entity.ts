import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { OrderToServiceEntity } from 'src/orders/entities/order-service.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity('services')
export class ServiceEntity extends CustomBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('float')
    price: number;

    @Column({ nullable: true })
    icon: string;

    @OneToMany(() => OrderToServiceEntity, (orderToService) => orderToService.service) // be careful of this, populate will not work if you miss this up
    orderToService: OrderToServiceEntity[];
}