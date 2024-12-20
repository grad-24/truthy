import { Expose, Transform } from 'class-transformer';
import { ModelSerializer } from 'src/common/serializer/model.serializer';

/**
 * Service Serializer
 */
export class ServiceSerializer extends ModelSerializer {
    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    icon: string;

    @Transform(({ value }) => value.toFixed(2), { toPlainOnly: true })
    @Expose()
    formattedPrice: string;
}