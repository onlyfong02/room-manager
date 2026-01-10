import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RoomGroupsService } from './room-groups.service';
import { CreateRoomGroupDto, UpdateRoomGroupDto } from './dto/room-group.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('room-groups')
@UseGuards(JwtAuthGuard)
export class RoomGroupsController {
    constructor(private readonly roomGroupsService: RoomGroupsService) { }

    @Post()
    create(@Request() req, @Body() createRoomGroupDto: CreateRoomGroupDto) {
        return this.roomGroupsService.create(req.user.userId, createRoomGroupDto);
    }

    @Get()
    findAll(@Request() req, @Query('buildingId') buildingId?: string) {
        return this.roomGroupsService.findAll(req.user.userId, buildingId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.roomGroupsService.findOne(id, req.user.userId);
    }

    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateRoomGroupDto: UpdateRoomGroupDto) {
        return this.roomGroupsService.update(id, req.user.userId, updateRoomGroupDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.roomGroupsService.remove(id, req.user.userId);
    }
}
