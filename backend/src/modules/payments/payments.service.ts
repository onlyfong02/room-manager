import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '@modules/payments/schemas/payment.schema';
import { CreatePaymentDto, UpdatePaymentDto } from '@modules/payments/dto/payment.dto';

@Injectable()
export class PaymentsService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

    async create(ownerId: string, receivedBy: string, createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = new this.paymentModel({
            ...createPaymentDto,
            ownerId,
            receivedBy,
        });
        return payment.save();
    }

    async findAll(ownerId: string): Promise<Payment[]> {
        return this.paymentModel.find({ ownerId, isDeleted: false })
            .populate('contractId tenantId')
            .populate({
                path: 'invoiceId',
                populate: { path: 'roomId', populate: { path: 'buildingId' } }
            })
            .exec();
    }

    async findOne(id: string, ownerId: string): Promise<Payment> {
        const payment = await this.paymentModel.findOne({ _id: id, ownerId, isDeleted: false }).populate('invoiceId contractId tenantId').exec();
        if (!payment) throw new NotFoundException('Payment not found');
        return payment;
    }

    async update(id: string, ownerId: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.paymentModel
            .findOneAndUpdate({ _id: id, ownerId, isDeleted: false }, { $set: updatePaymentDto }, { new: true })
            .exec();
        if (!payment) throw new NotFoundException('Payment not found');
        return payment;
    }

    async remove(id: string, ownerId: string): Promise<void> {
        const result = await this.paymentModel.updateOne({ _id: id, ownerId, isDeleted: false }, { $set: { isDeleted: true } }).exec();
        if (result.matchedCount === 0) throw new NotFoundException('Payment not found');
    }
}
