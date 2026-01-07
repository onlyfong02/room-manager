import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsArray, IsMongoId } from 'class-validator';
import { RoomStatus } from '@common/constants/enums';

export class CreateRoomDto {
    @IsMongoId()
    @IsNotEmpty()
    buildingId: string;

    @IsString()
    @IsNotEmpty()
    roomCode: string;

    @IsString()
    @IsNotEmpty()
    roomName: string;

    @IsNumber()
    @IsOptional()
    floor?: number;

    @IsNumber()
    @IsOptional()
    area?: number;

    @IsNumber()
    @IsNotEmpty()
    basePrice: number;

    @IsArray()
    @IsOptional()
    amenities?: string[];

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateRoomDto {
    @IsString()
    @IsOptional()
    roomName?: string;

    @IsNumber()
    @IsOptional()
    floor?: number;

    @IsNumber()
    @IsOptional()
    area?: number;

    @IsNumber()
    @IsOptional()
    basePrice?: number;

    @IsEnum(RoomStatus)
    @IsOptional()
    status?: RoomStatus;

    @IsArray()
    @IsOptional()
    amenities?: string[];

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateIndexesDto {
    @IsNumber()
    @IsOptional()
    currentElectricIndex?: number;

    @IsNumber()
    @IsOptional()
    currentWaterIndex?: number;
}
