import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogRepository } from './auditLog.repository';
import { AuditLogSerializer } from './auditLog.serializer';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLogRepository)
        private readonly repository: AuditLogRepository,
    ) { }

    logEvent(
        userId: string,
        entityId: string,
        entityType: string,
        eventType: string,
        notes?: string,
    ): Promise<AuditLogSerializer> {
        const logData: Partial<AuditLogSerializer> = {
            userId,
            entityId,
            entityType,
            eventType,
            notes,
            timestamp: new Date(),
        };

        return this.repository.createEntity(logData);
    }
}
