import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceSchema } from './schemas/service.schema';
import { BuildingsModule } from '../buildings/buildings.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
        BuildingsModule, // Import BuildingsModule to ensure Building model is available for population
    ],
    controllers: [ServicesController],
    providers: [ServicesService],
    exports: [ServicesService],
})
export class ServicesModule { }
