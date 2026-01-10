import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
    constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) { }

    private generateCode(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `SV-${timestamp}-${random}`;
    }

    async create(ownerId: string, createServiceDto: CreateServiceDto): Promise<Service> {
        let code = this.generateCode();

        // Ensure uniqueness
        let attempts = 0;
        while (attempts < 5) {
            const existing = await this.serviceModel.findOne({ code, ownerId: new Types.ObjectId(ownerId) }).exec();
            if (!existing) break;
            code = this.generateCode() + Math.floor(Math.random() * 10);
            attempts++;
        }

        const service = new this.serviceModel({
            ...createServiceDto,
            code,
            ownerId: new Types.ObjectId(ownerId),
            buildingIds: createServiceDto.buildingIds?.map(id => new Types.ObjectId(id)) || [],
        });
        return service.save();
    }

    async findAll(ownerId: string): Promise<Service[]> {
        return this.serviceModel
            .find({ ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .populate('buildingIds', 'name code')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string, ownerId: string): Promise<Service> {
        const service = await this.serviceModel
            .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false })
            .populate('buildingIds', 'name code')
            .exec();
        if (!service) throw new NotFoundException('Service not found');
        return service;
    }

    async findByBuilding(buildingId: string, ownerId: string): Promise<Service[]> {
        return this.serviceModel
            .find({
                ownerId: new Types.ObjectId(ownerId),
                isDeleted: false,
                $or: [
                    { buildingScope: 'ALL' },
                    { buildingScope: 'SPECIFIC', buildingIds: new Types.ObjectId(buildingId) }
                ]
            })
            .sort({ name: 1 })
            .exec();
    }

    async update(id: string, ownerId: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
        const updateData: any = { ...updateServiceDto };
        if (updateServiceDto.buildingIds) {
            updateData.buildingIds = updateServiceDto.buildingIds.map(id => new Types.ObjectId(id));
        }

        const service = await this.serviceModel
            .findOneAndUpdate(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: updateData },
                { new: true }
            )
            .populate('buildingIds', 'name code')
            .exec();
        if (!service) throw new NotFoundException('Service not found');
        return service;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.serviceModel
            .updateOne(
                { _id: id, ownerId: new Types.ObjectId(ownerId), isDeleted: false },
                { $set: { isDeleted: true } }
            )
            .exec();
        if (result.matchedCount === 0) throw new NotFoundException('Service not found');
    }
}
