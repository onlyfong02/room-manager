import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract, ContractSchema } from './schemas/contract.schema';

import { RoomsModule } from '../rooms/rooms.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ServicesModule } from '../services/services.module';

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
