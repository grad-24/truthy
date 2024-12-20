import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, ValidateIf } from 'class-validator';

import { CommonSearchFieldDto } from 'src/common/extra/common-search-field.dto';

export class UserSearchFilterDto extends PartialType(CommonSearchFieldDto) {
    @ApiPropertyOptional()
    @ValidateIf((object, value) => value !== undefined) // Skip validation if value is not provided
    @Type(() => Number)
    @IsInt()
    role?: number; // Optional property
}
