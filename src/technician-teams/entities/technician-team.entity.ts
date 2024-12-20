import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TechnicianEntity } from 'src/auth/entity/user.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Entity('team')
export class TechnicianTeamEntity extends CustomBaseEntity {
    @Column()
    name: string;

    @Column('jsonb')
    busyTimes: Array<{
        start_date: Date;
        end_date: Date;
        order_id: number;
    }>;

    @Column('jsonb')
    dailyBreaks: Array<{
        start_hour: string;
        end_hour: string;
    }>;

    @OneToMany(() => OrderEntity, order => order.team)
    orders: OrderEntity[];

    @OneToMany(() => TechnicianEntity, technician => technician.team)
    technicians: TechnicianEntity[];
}
