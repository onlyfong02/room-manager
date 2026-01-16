import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from '@modules/invoices/invoices.service';
import { InvoicesController } from '@modules/invoices/invoices.controller';
import { Invoice, InvoiceSchema } from '@modules/invoices/schemas/invoice.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])],
    controllers: [InvoicesController],
    providers: [InvoicesService],
    exports: [InvoicesService],
})
export class InvoicesModule { }
