import { EntityRepository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';  // Adjust path as needed
import { plainToClass } from 'class-transformer';
import { BaseRepository } from 'src/common/repository/base.repository';
import { ServiceSerializer } from '../serializer/service.serializer';

@EntityRepository(ServiceEntity)
export class ServiceRepository extends BaseRepository<ServiceEntity, ServiceSerializer> {
    /**
     * Transform service entity to service serializer
     * @param model
     * @param transformOption
     */
    transform(model: ServiceEntity, transformOption = {}): ServiceSerializer {
        return plainToClass(
            ServiceSerializer,
            model,
            transformOption
        );
    }

    /**
     * Transform services collection to service serializers
     * @param models
     * @param transformOption
     */
    transformMany(models: ServiceEntity[], transformOption = {}): ServiceSerializer[] {
        return models.map((model) => this.transform(model, transformOption));
    }
}