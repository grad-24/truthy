import { BaseRepository } from "src/common/repository/base.repository";
import { EntityRepository } from "typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderSerializer } from "./serializer/order.serializer";
import { classToPlain, plainToClass } from "class-transformer";

@EntityRepository(OrderEntity)
export class OrderRepository extends BaseRepository<OrderEntity, OrderSerializer> {
    /**
 * transform order
 * @param model
 * @param transformOption
 */
    transform(model: OrderEntity, transformOption = {}): OrderSerializer {
        return plainToClass(
            OrderSerializer,
            classToPlain(model, transformOption),
            transformOption
        );
    }

    /**
     * transform orders collection
     * @param models
     * @param transformOption
     */
    transformMany(models: OrderEntity[], transformOption = {}): OrderSerializer[] {
        return models.map((model) => this.transform(model, transformOption));
    }
}