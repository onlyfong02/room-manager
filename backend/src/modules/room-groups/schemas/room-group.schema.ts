import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomGroupDocument = RoomGroup & Document;

@Schema({ timestamps: true })
export class RoomGroup {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    ownerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Building', required: true, index: true })
    buildingId: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ trim: true })
    description: string;

    @Prop({ trim: true })
    color: string; // For UI display (e.g., badge color)

    @Prop({ default: 0 })
    sortOrder: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoomGroupSchema = SchemaFactory.createForClass(RoomGroup);

RoomGroupSchema.index({ ownerId: 1, buildingId: 1, isDeleted: 1 });
RoomGroupSchema.index({ buildingId: 1, isDeleted: 1 });
RoomGroupSchema.index({ name: 1 });
