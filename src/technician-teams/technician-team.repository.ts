import { BaseRepository } from "src/common/repository/base.repository";
import { EntityRepository } from "typeorm";
import { TechnicianTeamEntity } from "./entities/technician-team.entity";
import TechnicianTeamSerializer from "./serializer/technician-team.serializer";
import { classToPlain, plainToClass } from "class-transformer";

@EntityRepository(TechnicianTeamEntity)
export class TechnicianTeamRepository extends BaseRepository<TechnicianTeamEntity, TechnicianTeamSerializer> {
    /**
 * transform team
 * @param model
 * @param transformOption
 */
    transform(model: TechnicianTeamEntity, transformOption = {}): TechnicianTeamSerializer {
        return plainToClass(
            TechnicianTeamSerializer,
            classToPlain(model, transformOption),
            transformOption
        );
    }

    /**
     * transform teams collection
     * @param models
     * @param transformOption
     */
    transformMany(models: TechnicianTeamEntity[], transformOption = {}): TechnicianTeamSerializer[] {
        return models.map((model) => this.transform(model, transformOption));
    }
}