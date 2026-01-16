import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsService } from '@modules/contracts/contracts.service';
import { ContractsController } from '@modules/contracts/contracts.controller';
import { Contract, ContractSchema } from '@modules/contracts/schemas/contract.schema';

import { RoomsModule } from '@modules/rooms/rooms.module';
import { TenantsModule } from '@modules/tenants/tenants.module';
import { ServicesModule } from '@modules/services/services.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]),
        RoomsModule,
        TenantsModule,
        ServicesModule,
    ],
    controllers: [ContractsController],
    providers: [ContractsService],
    exports: [ContractsService],
})
export class ContractsModule { }
