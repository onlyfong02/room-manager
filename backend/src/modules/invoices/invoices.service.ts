import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) { }

    async create(ownerId: string, createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        // Calculate amounts
        const electricityUsed = (createInvoiceDto.currentElectricIndex || 0) - (createInvoiceDto.previousElectricIndex || 0);
        const electricityAmount = electricityUsed * (createInvoiceDto.electricityPrice || 0);

        const waterUsed = (createInvoiceDto.currentWaterIndex || 0) - (createInvoiceDto.previousWaterIndex || 0);
        const waterAmount = waterUsed * (createInvoiceDto.waterPrice || 0);

        const serviceTotal = (createInvoiceDto.serviceCharges || []).reduce((sum, charge) => sum + charge.amount, 0);
        const totalAmount = createInvoiceDto.rentAmount + electricityAmount + waterAmount + serviceTotal;

        const invoiceNumber = `INV-${Date.now()}`;

        const invoice = new this.invoiceModel({
            ...createInvoiceDto,
            ownerId,
            invoiceNumber,
            billingPeriod: { month: createInvoiceDto.month, year: createInvoiceDto.year },
            electricityUsed,
            electricityAmount,
            waterUsed,
            waterAmount,
            totalAmount,
            remainingAmount: totalAmount,
        });

        return invoice.save();
    }

    async findAll(ownerId: string): Promise<Invoice[]> {
        return this.invoiceModel.find({ ownerId, isDeleted: false })
            .populate('contractId tenantId')
            .populate({ path: 'roomId', populate: { path: 'buildingId' } })
            .exec();
    }

    async findOne(id: string, ownerId: string): Promise<Invoice> {
        const invoice = await this.invoiceModel.findOne({ _id: id, ownerId, isDeleted: false }).populate('contractId roomId tenantId').exec();
        if (!invoice) throw new NotFoundException('Invoice not found');
        return invoice;
    }

    async update(id: string, ownerId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const updateData: any = { ...updateInvoiceDto };

        if (updateInvoiceDto.paidAmount !== undefined) {
            const invoice = await this.findOne(id, ownerId);
            updateData.remainingAmount = invoice.totalAmount - updateInvoiceDto.paidAmount;
        }

        const invoice = await this.invoiceModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updateData }, { new: true })
            .exec();
        if (!invoice) throw new NotFoundException('Invoice not found');
        return invoice;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.invoiceModel.updateOne({ _id: id, ownerId, isDeleted: false }, { $set: { isDeleted: true } }).exec();
        if (result.matchedCount === 0) throw new NotFoundException('Invoice not found');
    }
}
