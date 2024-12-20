import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class DailyBreakDto {
    @IsNotEmpty()
    @IsString()
    start_hour: string;

    @IsNotEmpty()
    @IsString()
    end_hour: string;
}

export class CreateTechnicianTeamDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNumber({}, { each: true })
    technicians: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DailyBreakDto)
    dailyBreaks: DailyBreakDto[];
}
