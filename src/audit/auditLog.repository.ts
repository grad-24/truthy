import { classToPlain, plainToClass } from "class-transformer";
import { BaseRepository } from "src/common/repository/base.repository";
import { EntityRepository } from "typeorm";
import { AuditLogSerializer } from "./auditLog.serializer";
import { AuditLogEntity } from "./entity/auditLog.entity";

@EntityRepository(AuditLogEntity)
export class AuditLogRepository extends BaseRepository<AuditLogEntity, AuditLogSerializer> {
    /**
 * transform audit log
 * @param model
 * @param transformOption
 */
    transform(model: AuditLogEntity, transformOption = {}): AuditLogSerializer {
        return plainToClass(
            AuditLogSerializer,
            classToPlain(model, transformOption),
            transformOption
        );
    }

    /**
     * transform audit logs collection
     * @param models
     * @param transformOption
     */
    transformMany(models: AuditLogEntity[], transformOption = {}): AuditLogSerializer[] {
        return models.map((model) => this.transform(model, transformOption));
    }
}