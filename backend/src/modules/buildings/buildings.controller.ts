import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/building.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('buildings')
@UseGuards(JwtAuthGuard)
export class BuildingsController {
    constructor(private readonly buildingsService: BuildingsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createBuildingDto: CreateBuildingDto) {
        return this.buildingsService.create(user.userId, createBuildingDto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.buildingsService.findAll(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.buildingsService.findOne(id, user.userId);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() updateBuildingDto: UpdateBuildingDto,
    ) {
        return this.buildingsService.update(id, user.userId, updateBuildingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.buildingsService.remove(id, user.userId);
    }
}
