import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), [
    'start_date',
    'end_date',
    'customerId',
    'teamId',
    'services'
] as const) { }
