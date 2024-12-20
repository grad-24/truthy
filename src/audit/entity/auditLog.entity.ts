import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity extends CustomBaseEntity {
    @CreateDateColumn({ type: 'timestamp' })
    timestamp: Date;

    @Column()
    userId: string;

    @Column({ nullable: true })
    entityId: string;

    @Column()
    entityType: string;

    @Column()
    eventType: string;

    @Column({ nullable: true })
    notes?: string;
}
