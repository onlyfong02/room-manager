import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    ward: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    city: string;
}

export class CreateBuildingDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateBuildingDto {
    @IsString()
    @IsOptional()
    name?: string;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;

    @IsString()
    @IsOptional()
    description?: string;
}
