import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto } from './dto/contract.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createContractDto: CreateContractDto) {
        return this.contractsService.create(user.userId, createContractDto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.contractsService.findAll(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.contractsService.findOne(id, user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateContractDto: UpdateContractDto) {
        return this.contractsService.update(id, user.userId, updateContractDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.contractsService.remove(id, user.userId);
    }
}
