import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from '@modules/rooms/rooms.service';
import { RoomsController } from '@modules/rooms/rooms.controller';
import { Room, RoomSchema } from '@modules/rooms/schemas/room.schema';
import { Building, BuildingSchema } from '@modules/buildings/schemas/building.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Room.name, schema: RoomSchema },
        { name: Building.name, schema: BuildingSchema },
    ])],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule { }
