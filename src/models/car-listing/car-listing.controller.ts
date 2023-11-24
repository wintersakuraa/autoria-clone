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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { ReqUser } from '@common/decorators';
import { RoleGuard } from '@common/guards';
import {
  PaginationResponse,
  RequestUser,
  ResponseMetaWrapper,
} from '@common/types/http.types';
import {
  CarListingQueryDto,
  CreateCarListingDto,
} from '@models/car-listing/dto';
import { UpdateCarListingDto } from '@models/car-listing/dto/update-car-listing.dto';
import { Role } from '@models/user/user.enums';

import { CarListingService } from './car-listing.service';
import { CarListingMeta, CarListingWithMeta } from './car-listing.types';
import { CarListing } from './entities/car-listing.entity';

@ApiTags('car-listings')
@ApiBearerAuth('jwt-auth')
@Controller('car-listings')
export class CarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @ApiOperation({ summary: 'Create car listing' })
  @UseGuards(RoleGuard([Role.SELLER, Role.MANAGER, Role.ADMIN]))
  @Post()
  create(
    @ReqUser() user: RequestUser,
    @Body() dto: CreateCarListingDto,
  ): Promise<CarListing | CarListingWithMeta> {
    return this.carListingService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Get all car listings' })
  @Get()
  getAll(
    @Query() query: CarListingQueryDto,
  ): Promise<PaginationResponse<CarListing[]>> {
    return this.carListingService.getAll(query);
  }

  @ApiOperation({ summary: 'Get car listing by id' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<CarListingWithMeta> {
    return this.carListingService.getById(id);
  }

  @ApiOperation({ summary: 'Update car listing' })
  @UseGuards(RoleGuard([Role.SELLER, Role.MANAGER, Role.ADMIN]))
  @Patch(':listingId')
  update(
    @ReqUser() user: RequestUser,
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @Body() dto: UpdateCarListingDto,
  ): Promise<UpdateResult | ResponseMetaWrapper<UpdateResult, CarListingMeta>> {
    return this.carListingService.update(user.id, listingId, dto);
  }

  @ApiOperation({ summary: 'Delete car listing' })
  @UseGuards(RoleGuard([Role.SELLER, Role.MANAGER, Role.ADMIN]))
  @Delete(':listingId')
  delete(
    @ReqUser() user: RequestUser,
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ): Promise<DeleteResult> {
    return this.carListingService.delete(user.id, listingId);
  }

  @ApiOperation({ summary: 'Get car listing prices in all 3 currencies' })
  @Get(':id/prices')
  getPricesInCurrencies(@Param('id', ParseUUIDPipe) id: string) {
    return this.carListingService.getPricesInCurrencies(id);
  }

  @ApiOperation({ summary: 'Upload car image' })
  @UseGuards(RoleGuard([Role.SELLER, Role.MANAGER, Role.ADMIN]))
  @UseInterceptors(FileInterceptor('image'))
  @Post(':id/upload')
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UpdateResult> {
    return this.carListingService.upload(id, file);
  }
}
