import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto, UpdateRoomDto, UpdateIndexesDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
    constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) { }

    async create(ownerId: string, createRoomDto: CreateRoomDto): Promise<Room> {
        const room = new this.roomModel({ ...createRoomDto, ownerId });
        return room.save();
    }

    async findAll(ownerId: string, buildingId?: string): Promise<Room[]> {
        const filter: any = { ownerId, isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        return this.roomModel.find(filter).exec();
    }

    async findOne(id: string, ownerId: string): Promise<Room> {
        const room = await this.roomModel.findOne({ _id: id, ownerId, isDeleted: false }).exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async update(id: string, ownerId: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
        const room = await this.roomModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updateRoomDto }, { new: true })
            .exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async updateIndexes(id: string, ownerId: string, updateIndexesDto: UpdateIndexesDto): Promise<Room> {
        const room = await this.roomModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updateIndexesDto }, { new: true })
            .exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.roomModel.updateOne({ _id: id, ownerId, isDeleted: false }, { $set: { isDeleted: true } }).exec();
        if (result.matchedCount === 0) throw new NotFoundException('Room not found');
    }
}
