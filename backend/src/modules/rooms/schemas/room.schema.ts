import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoomStatus } from '@common/constants/enums';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
    @Prop({ type: Types.ObjectId, ref: 'Building', required: true, index: true })
    buildingId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true, trim: true, index: true })
    roomCode: string;

    @Prop({ required: true, trim: true })
    roomName: string;

    @Prop({ default: 1 })
    floor: number;

    @Prop({ default: 0 })
    area: number;

    @Prop({ required: true, default: 0 })
    basePrice: number;

    @Prop({ type: String, enum: RoomStatus, default: RoomStatus.AVAILABLE })
    status: RoomStatus;

    @Prop({ default: 0 })
    currentElectricIndex: number;

    @Prop({ default: 0 })
    currentWaterIndex: number;

    @Prop({ type: [String], default: [] })
    amenities: string[];

    @Prop({ trim: true })
    description: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ buildingId: 1, isDeleted: 1 });
RoomSchema.index({ ownerId: 1, status: 1, isDeleted: 1 });
RoomSchema.index({ roomCode: 1 });
