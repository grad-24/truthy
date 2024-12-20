import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogProcessor } from './auditLog.processor';
import { AuditLogRepository } from './auditLog.repository';
import { AuditLogService } from './auditLog.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuditLogRepository]),
    ],
    providers: [AuditLogService, AuditLogProcessor],
    exports: [AuditLogService]
})
export class AuditLogModule { }
