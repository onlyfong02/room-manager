import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { Building, BuildingDocument } from '../buildings/schemas/building.schema';
import { CreateRoomDto, UpdateRoomDto, UpdateIndexesDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
    ) { }

    /**
     * Generate unique room code
     * Format: R-{timestamp}-{random4digits}
     */
    private generateRoomCode(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `R-${timestamp}-${random}`;
    }

    async create(ownerId: string, createRoomDto: CreateRoomDto): Promise<Room> {
        // Auto-generate unique room code
        let roomCode = this.generateRoomCode();

        // Ensure uniqueness (retry if collision)
        let attempts = 0;
        while (attempts < 5) {
            const existing = await this.roomModel.findOne({ roomCode }).exec();
            if (!existing) break;
            roomCode = this.generateRoomCode();
            attempts++;
        }

        const room = new this.roomModel({
            ...createRoomDto,
            ownerId: new Types.ObjectId(ownerId),
            buildingId: new Types.ObjectId(createRoomDto.buildingId),
            roomGroupId: createRoomDto.roomGroupId ? new Types.ObjectId(createRoomDto.roomGroupId) : undefined,
            roomCode
        });
        const savedRoom = await room.save();

        // Increment building totalRooms
        console.log('[RoomsService.create] buildingId:', createRoomDto.buildingId);
        const building = await this.buildingModel.findById(createRoomDto.buildingId);
        console.log('[RoomsService.create] building found:', building ? building._id : 'null');
        if (building) {
            console.log('[RoomsService.create] current totalRooms:', building.totalRooms);
            building.totalRooms = (building.totalRooms || 0) + 1;
            await building.save();
            console.log('[RoomsService.create] new totalRooms:', building.totalRooms);
        }

        return savedRoom;
    }

    async findAll(ownerId: string, buildingId?: string): Promise<Room[]> {
        const filter: any = { ownerId: new Types.ObjectId(ownerId), isDeleted: false };
        if (buildingId) filter.buildingId = new Types.ObjectId(buildingId);
        return this.roomModel.find(filter).populate('buildingId roomGroupId').sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string, ownerId: string): Promise<Room> {
        const room = await this.roomModel
            .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async update(id: string, ownerId: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
        // First fetch the room to check current status
        const existingRoom = await this.roomModel
            .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .exec();
        if (!existingRoom) throw new NotFoundException('Room not found');

        // Prevent updating buildingId
        const dto = updateRoomDto as any;
        if (dto.buildingId) {
            delete dto.buildingId;
        }

        // Prevent changing status of OCCUPIED rooms
        if (existingRoom.status === 'OCCUPIED' && dto.status && dto.status !== 'OCCUPIED') {
            throw new BadRequestException('Cannot change status of occupied room');
        }

        // Convert roomGroupId to ObjectId if present
        if (dto.roomGroupId) {
            dto.roomGroupId = new Types.ObjectId(dto.roomGroupId);
        }

        const room = await this.roomModel
            .findOneAndUpdate(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: updateRoomDto },
                { new: true }
            )
            .exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async updateIndexes(id: string, ownerId: string, updateIndexesDto: UpdateIndexesDto): Promise<Room> {
        const room = await this.roomModel
            .findOneAndUpdate(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: updateIndexesDto },
                { new: true }
            )
            .exec();
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        // First find the room to get buildingId and check status
        const room = await this.roomModel
            .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .exec();
        if (!room) throw new NotFoundException('Room not found');

        // Check if room is OCCUPIED
        if (room.status === 'OCCUPIED') {
            throw new BadRequestException('Cannot delete room with OCCUPIED status');
        }

        // Soft delete the room
        await this.roomModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();

        // Decrement building totalRooms
        const building = await this.buildingModel.findById(room.buildingId);
        if (building && building.totalRooms > 0) {
            building.totalRooms -= 1;
            await building.save();
        }
    }
}
