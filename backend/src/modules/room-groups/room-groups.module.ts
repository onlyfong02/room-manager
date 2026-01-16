import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomGroupsController } from '@modules/room-groups/room-groups.controller';
import { RoomGroupsService } from '@modules/room-groups/room-groups.service';
import { RoomGroup, RoomGroupSchema } from '@modules/room-groups/schemas/room-group.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: RoomGroup.name, schema: RoomGroupSchema }]),
    ],
    controllers: [RoomGroupsController],
    providers: [RoomGroupsService],
    exports: [RoomGroupsService],
})
export class RoomGroupsModule { }
