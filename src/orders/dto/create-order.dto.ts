import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderPriorityEnum } from '../entities/order.entity';
import { IsValidTimeRange } from 'src/common/decorators/is-valid-time-range.decorator';

export class CreateOrderDto {
    @ApiProperty({ description: 'Title of the order' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Description of the work to be done' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Priority of the order' })
    @IsNotEmpty()
    @IsEnum(OrderPriorityEnum)
    priority: OrderPriorityEnum;

    @ApiProperty({ description: 'Start date and time of the order' })
    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @ApiProperty({ description: 'End date and time of the order' })
    @IsDateString()
    @IsNotEmpty()
    @IsValidTimeRange('start_date', {
        // message: 'end_date must be at least 30 minutes later than start_date'
    })
    end_date: string;

    @ApiProperty({ description: 'Total cost of the order' })
    @IsNumber()
    @IsNotEmpty()
    total_cost: number;

    @ApiProperty({ description: 'Address where the service is performed' })
    @IsString()
    @IsNotEmpty()
    location_address: string;

    @ApiProperty({ description: 'Latitude of the location (optional)', required: false })
    @IsOptional()
    @IsDecimal()
    location_latitude?: number;

    @ApiProperty({ description: 'Longitude of the location (optional)', required: false })
    @IsOptional()
    @IsDecimal()
    location_longitude?: number;

    @ApiProperty({ description: 'Foreign key linking to the Team' })
    @IsNumber()
    @IsNotEmpty()
    teamId: number;

    @ApiProperty({ description: 'Foreign key linking to the Customer' })
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsArray()
    @IsNumber({}, { each: true })
    services: number[];
}