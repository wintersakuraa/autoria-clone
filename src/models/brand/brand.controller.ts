import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { BaseQueryDto, UpdateNameDto } from '@common/dto';
import { CreateNameDto } from '@common/dto/create-name.dto';
import { RoleGuard } from '@common/guards';
import { PaginationResponse } from '@common/types/http.types';
import { Role } from '@models/user/user.enums';

import { BrandService } from './brand.service';
import { Brand } from './entities/brand.entity';

@ApiTags('brands')
@ApiBearerAuth('jwt-auth')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create car brand' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Post()
  create(@Body() dto: CreateNameDto): Promise<Brand> {
    return this.brandService.create(dto);
  }

  @ApiOperation({ summary: 'Get all car brands' })
  @Get()
  getAll(@Query() query: BaseQueryDto): Promise<PaginationResponse<Brand[]>> {
    return this.brandService.getAll(query);
  }

  @ApiOperation({ summary: 'Get car brand by id' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
    return this.brandService.getById(id);
  }

  @ApiOperation({ summary: 'Update car brand' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNameDto,
  ): Promise<UpdateResult> {
    return this.brandService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete car brand' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.brandService.delete(id);
  }
}
