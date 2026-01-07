import { IsNotEmpty, IsString, IsOptional, IsEmail, IsDate, IsEnum, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TenantStatus } from '@common/constants/enums';

class EmergencyContactDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsString()
    relationship: string;
}

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    idCard: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    dateOfBirth?: Date;

    @IsString()
    @IsOptional()
    permanentAddress?: string;

    @ValidateNested()
    @Type(() => EmergencyContactDto)
    @IsOptional()
    emergencyContact?: EmergencyContactDto;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateTenantDto {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsMongoId()
    @IsOptional()
    currentRoomId?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    moveInDate?: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    moveOutDate?: Date;

    @IsEnum(TenantStatus)
    @IsOptional()
    status?: TenantStatus;

    @ValidateNested()
    @Type(() => EmergencyContactDto)
    @IsOptional()
    emergencyContact?: EmergencyContactDto;

    @IsString()
    @IsOptional()
    notes?: string;
}
