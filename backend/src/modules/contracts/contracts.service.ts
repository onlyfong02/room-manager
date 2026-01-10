import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { CreateContractDto, UpdateContractDto } from './dto/contract.dto';

@Injectable()
export class ContractsService {
    constructor(@InjectModel(Contract.name) private contractModel: Model<ContractDocument>) { }

    async create(ownerId: string, createContractDto: CreateContractDto): Promise<Contract> {
        const contract = new this.contractModel({ ...createContractDto, ownerId });
        return contract.save();
    }

    async findAll(ownerId: string): Promise<Contract[]> {
        return this.contractModel.find({ ownerId, isDeleted: false })
            .populate('tenantId')
            .populate({ path: 'roomId', populate: { path: 'buildingId' } })
            .exec();
    }

    async findOne(id: string, ownerId: string): Promise<Contract> {
        const contract = await this.contractModel.findOne({ _id: id, ownerId, isDeleted: false }).populate('roomId tenantId').exec();
        if (!contract) throw new NotFoundException('Contract not found');
        return contract;
    }

    async update(id: string, ownerId: string, updateContractDto: UpdateContractDto): Promise<Contract> {
        const contract = await this.contractModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updateContractDto }, { new: true })
            .exec();
        if (!contract) throw new NotFoundException('Contract not found');
        return contract;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.contractModel.updateOne({ _id: id, ownerId, isDeleted: false }, { $set: { isDeleted: true } }).exec();
        if (result.matchedCount === 0) throw new NotFoundException('Contract not found');
    }
}
