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

import { UpdateNameDto } from '@common/dto';
import { RoleGuard } from '@common/guards';
import { PaginationResponse } from '@common/types/http.types';
import { CarModel } from '@models/car-model/entities/car-model.entity';
import { Role } from '@models/user/user.enums';

import { CarModelService } from './car-model.service';
import { CarModelQueryDto, CreateCarModelDto } from './dto';

@ApiTags('car-models')
@ApiBearerAuth('jwt-auth')
@Controller('car-models')
export class CarModelController {
  constructor(private readonly carModelService: CarModelService) {}

  @ApiOperation({ summary: 'Create car model' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Post()
  create(@Body() dto: CreateCarModelDto): Promise<CarModel> {
    return this.carModelService.create(dto);
  }

  @ApiOperation({ summary: 'Get all car models' })
  @Get()
  getAll(
    @Query() query: CarModelQueryDto,
  ): Promise<PaginationResponse<CarModel[]>> {
    return this.carModelService.getAll(query);
  }

  @ApiOperation({ summary: 'Get car model by id' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<CarModel> {
    return this.carModelService.getById(id);
  }

  @ApiOperation({ summary: 'Update car model' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNameDto,
  ): Promise<UpdateResult> {
    return this.carModelService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete car model' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.carModelService.delete(id);
  }
}
