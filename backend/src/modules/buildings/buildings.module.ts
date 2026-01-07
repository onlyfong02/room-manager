import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building, BuildingSchema } from './schemas/building.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Building.name, schema: BuildingSchema }]),
    ],
    controllers: [BuildingsController],
    providers: [BuildingsService],
    exports: [BuildingsService],
})
export class BuildingsModule { }
