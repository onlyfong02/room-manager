import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoomGroup, RoomGroupDocument } from './schemas/room-group.schema';
import { CreateRoomGroupDto, UpdateRoomGroupDto } from './dto/room-group.dto';

@Injectable()
export class RoomGroupsService {
    constructor(@InjectModel(RoomGroup.name) private roomGroupModel: Model<RoomGroupDocument>) { }

    async create(ownerId: string, createRoomGroupDto: CreateRoomGroupDto): Promise<RoomGroup> {
        const roomGroup = new this.roomGroupModel({
            ...createRoomGroupDto,
            ownerId: new Types.ObjectId(ownerId),
            buildingId: new Types.ObjectId(createRoomGroupDto.buildingId),
        });
        return roomGroup.save();
    }

    async findAll(ownerId: string, buildingId?: string): Promise<RoomGroup[]> {
        const filter: any = { ownerId: new Types.ObjectId(ownerId), isDeleted: false };
        if (buildingId) filter.buildingId = new Types.ObjectId(buildingId);
        return this.roomGroupModel
            .find(filter)
            .populate('buildingId')
            .sort({ sortOrder: 1, name: 1 })
            .exec();
    }

    async findOne(id: string, ownerId: string): Promise<RoomGroup> {
        const roomGroup = await this.roomGroupModel
            .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .exec();
        if (!roomGroup) throw new NotFoundException('Room group not found');
        return roomGroup;
    }

    async update(id: string, ownerId: string, updateRoomGroupDto: UpdateRoomGroupDto): Promise<RoomGroup> {
        const updateData: any = { ...updateRoomGroupDto };
        if (updateData.buildingId) {
            updateData.buildingId = new Types.ObjectId(updateData.buildingId);
        }

        const roomGroup = await this.roomGroupModel
            .findOneAndUpdate(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: updateData },
                { new: true }
            )
            .exec();
        if (!roomGroup) throw new NotFoundException('Room group not found');
        return roomGroup;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.roomGroupModel
            .updateOne(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: { isDeleted: true } }
            )
            .exec();
        if (result.matchedCount === 0) throw new NotFoundException('Room group not found');
    }
}
