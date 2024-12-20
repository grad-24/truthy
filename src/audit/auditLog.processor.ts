import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as config from 'config';
import { AuditLogService } from './auditLog.service';
import { AuditLogEntity } from './entity/auditLog.entity';

@Processor(config.get('audit.queueName'))
export class AuditLogProcessor {
    constructor(private readonly auditService: AuditLogService) { }

    @Process()
    async handleAuditLogJob(job: Job) {
        const { userId, entityId, entityType, eventType, notes } = job.data as AuditLogEntity;
        await this.auditService.logEvent(userId, entityId, entityType, eventType, notes);
    }
}
