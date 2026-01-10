import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsArray, IsBoolean, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class ServicePriceTierDto {
    @IsNumber()
    fromValue: number;

    @IsNumber()
    toValue: number;

    @IsNumber()
    price: number;
}

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsEnum(['FIXED', 'TABLE'])
    @IsOptional()
    priceType?: string;

    @IsNumber()
    @IsOptional()
    fixedPrice?: number;

    @ValidateNested({ each: true })
    @Type(() => ServicePriceTierDto)
    @IsOptional()
    priceTiers?: ServicePriceTierDto[];

    @IsEnum(['ALL', 'SPECIFIC'])
    @IsOptional()
    buildingScope?: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    buildingIds?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsEnum(['FIXED', 'TABLE'])
    @IsOptional()
    priceType?: string;

    @IsNumber()
    @IsOptional()
    fixedPrice?: number;

    @ValidateNested({ each: true })
    @Type(() => ServicePriceTierDto)
    @IsOptional()
    priceTiers?: ServicePriceTierDto[];

    @IsEnum(['ALL', 'SPECIFIC'])
    @IsOptional()
    buildingScope?: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    buildingIds?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
