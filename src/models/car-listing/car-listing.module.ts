import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '@models/brand/entities/brand.entity';
import { CarModel } from '@models/car-model/entities/car-model.entity';
import { User } from '@models/user/entities/user.entity';
import { CurrencyModule } from '@modules/currency/currency.module';
import { S3Module } from '@modules/s3/s3.module';

import { CarListingController } from './car-listing.controller';
import { CarListingService } from './car-listing.service';
import { CarListing } from './entities/car-listing.entity';

@Module({
  imports: [
    HttpModule,
    CurrencyModule,
    S3Module,
    TypeOrmModule.forFeature([CarListing, User, CarModel, Brand]),
  ],
  controllers: [CarListingController],
  providers: [CarListingService],
})
export class CarListingModule {}
