import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { IsValidTimeRange } from 'src/common/decorators/is-valid-time-range.decorator';
import { CreateTechnicianTeamDto } from './create-technician-team.dto';

class BusyTimesDto {
    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @IsNotEmpty()
    @IsValidTimeRange('start_date', {
        message: 'end_date must be at least 30 minutes later than start_date'
    })
    end_date: Date;

    @IsNumber()
    @IsNotEmpty()
    order_id: number;
}

export class UpdateTechnicianTeamDto extends PartialType(CreateTechnicianTeamDto) {
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => BusyTimesDto)
    busyTimes: BusyTimesDto[];
}
