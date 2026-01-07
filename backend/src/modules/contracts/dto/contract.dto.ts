import { IsNotEmpty, IsMongoId, IsEnum, IsDate, IsNumber, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractType, ContractStatus, PaymentCycle } from '@common/constants/enums';

class ServiceChargeDto {
    @IsString()
    name: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    isRecurring?: boolean;
}

export class CreateContractDto {
    @IsMongoId()
    @IsNotEmpty()
    roomId: string;

    @IsMongoId()
    @IsNotEmpty()
    tenantId: string;

    @IsEnum(ContractType)
    @IsOptional()
    contractType?: ContractType;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    endDate: Date;

    @IsNumber()
    @IsNotEmpty()
    rentPrice: number;

    @IsNumber()
    @IsOptional()
    depositAmount?: number;

    @IsNumber()
    @IsOptional()
    electricityPrice?: number;

    @IsNumber()
    @IsOptional()
    waterPrice?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServiceChargeDto)
    @IsOptional()
    serviceCharges?: ServiceChargeDto[];

    @IsEnum(PaymentCycle)
    @IsOptional()
    paymentCycle?: PaymentCycle;

    @IsNumber()
    @IsOptional()
    paymentDueDay?: number;

    @IsNumber()
    @IsOptional()
    initialElectricIndex?: number;

    @IsNumber()
    @IsOptional()
    initialWaterIndex?: number;

    @IsString()
    @IsOptional()
    terms?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateContractDto {
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @IsNumber()
    @IsOptional()
    rentPrice?: number;

    @IsEnum(ContractStatus)
    @IsOptional()
    status?: ContractStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}
