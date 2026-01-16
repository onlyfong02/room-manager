import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from '@modules/services/services.controller';
import { ServicesService } from '@modules/services/services.service';
import { Service, ServiceSchema } from '@modules/services/schemas/service.schema';
import { BuildingsModule } from '@modules/buildings/buildings.module';

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
