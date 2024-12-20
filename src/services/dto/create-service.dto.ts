import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServiceDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    icon: string;
}