import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room, RoomSchema } from './schemas/room.schema';
import { Building, BuildingSchema } from '../buildings/schemas/building.schema';

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
