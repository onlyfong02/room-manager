import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BuildingDocument = Building & Document;

@Schema({ timestamps: true })
export class Building {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop()
    nameNormalized: string;

    @Prop({ required: true, trim: true, unique: true })
    code: string;

    @Prop({
        type: {
            street: String,
            ward: String,
            district: String,
            city: String,
        },
        required: true,
    })
    address: {
        street: string;
        ward: string;
        district: string;
        city: string;
    };

    @Prop({ trim: true })
    description: string;

    @Prop({ default: 0 })
    totalRooms: number;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const BuildingSchema = SchemaFactory.createForClass(Building);

BuildingSchema.index({ ownerId: 1, isDeleted: 1 });
BuildingSchema.index({ code: 1 });
