import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Building, BuildingDocument } from './schemas/building.schema';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/building.dto';

@Injectable()
export class BuildingsService {
    constructor(
        @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
    ) { }

    async create(ownerId: string, createBuildingDto: CreateBuildingDto): Promise<Building> {
        const building = new this.buildingModel({
            ...createBuildingDto,
            ownerId,
        });
        return building.save();
    }

    async findAll(ownerId: string): Promise<Building[]> {
        return this.buildingModel.find({ ownerId, isDeleted: false }).exec();
    }

    async findOne(id: string, ownerId: string): Promise<Building> {
        const building = await this.buildingModel
            .findOne({ _id: id, ownerId, isDeleted: false })
            .exec();

        if (!building) {
            throw new NotFoundException('Building not found');
        }

        return building;
    }

    async update(id: string, ownerId: string, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
        const building = await this.buildingModel
            .findOneAndUpdate(
                { _id: id, ownerId, isDeleted: false },
                { $set: updateBuildingDto },
                { new: true },
            )
            .exec();

        if (!building) {
            throw new NotFoundException('Building not found');
        }

        return building;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.buildingModel
            .updateOne(
                { _id: id, ownerId, isDeleted: false },
                { $set: { isDeleted: true } },
            )
            .exec();

        if (result.matchedCount === 0) {
            throw new NotFoundException('Building not found');
        }
    }
}
