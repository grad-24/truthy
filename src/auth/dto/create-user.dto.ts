import { ArrayNotEmpty, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

import { UserStatusEnum } from 'src/auth/user-status.enum';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

const statusEnumArray = [
  UserStatusEnum.ACTIVE,
  UserStatusEnum.INACTIVE,
  UserStatusEnum.BLOCKED
];

/**
 * create user data transform object
 */
export class CreateUserDto extends OmitType(RegisterUserDto, [
  'password'
] as const) {
  @IsIn(statusEnumArray, {
    message: `isIn-{"items":"${statusEnumArray.join(',')}"}`
  })
  status: UserStatusEnum;
}

export class CreateAdminDto extends CreateUserDto {

}

export class CreateCustomerDto extends CreateUserDto {

}

export class CreateTechnicianDto extends CreateUserDto {
  @IsOptional()
  @IsNumber()
  teamId: number;

  @IsOptional()
  @IsBoolean()
  isTeamLeader?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialities: string[];
}