import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BuildingQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}
