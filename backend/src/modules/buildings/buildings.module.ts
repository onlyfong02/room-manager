import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building, BuildingSchema } from './schemas/building.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import { RoomGroup, RoomGroupSchema } from '../room-groups/schemas/room-group.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Building.name, schema: BuildingSchema },
            { name: Room.name, schema: RoomSchema },
            { name: RoomGroup.name, schema: RoomGroupSchema },
        ]),
    ],
    controllers: [BuildingsController],
    providers: [BuildingsService],
    exports: [BuildingsService],
})
export class BuildingsModule { }
