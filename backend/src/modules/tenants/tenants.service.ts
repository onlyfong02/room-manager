import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
    constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) { }

    async create(ownerId: string, createTenantDto: CreateTenantDto): Promise<Tenant> {
        const tenant = new this.tenantModel({ ...createTenantDto, ownerId });
        return tenant.save();
    }

    async findAll(ownerId: string): Promise<Tenant[]> {
        return this.tenantModel.find({ ownerId, isDeleted: false }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string, ownerId: string): Promise<Tenant> {
        const tenant = await this.tenantModel.findOne({ _id: id, ownerId, isDeleted: false }).exec();
        if (!tenant) throw new NotFoundException('Tenant not found');
        return tenant;
    }

    async update(id: string, ownerId: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
        const tenant = await this.tenantModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updateTenantDto }, { new: true })
            .exec();
        if (!tenant) throw new NotFoundException('Tenant not found');
        return tenant;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.tenantModel.updateOne({ _id: id, ownerId, isDeleted: false }, { $set: { isDeleted: true } }).exec();
        if (result.matchedCount === 0) throw new NotFoundException('Tenant not found');
    }
}
