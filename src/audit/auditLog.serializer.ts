import { Expose } from 'class-transformer';
import { ModelSerializer } from 'src/common/serializer/model.serializer';

export class AuditLogSerializer extends ModelSerializer {
    @Expose()
    timestamp: Date;

    @Expose()
    userId: string;

    @Expose()
    entityId: string;

    @Expose()
    entityType: string;

    @Expose()
    eventType: string;

    @Expose()
    notes?: string;
}
