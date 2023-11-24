import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModel } from '@models/car-model/entities/car-model.entity';

import { CarModelController } from './car-model.controller';
import { CarModelService } from './car-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarModel])],
  controllers: [CarModelController],
  providers: [CarModelService],
})
export class CarModelModule {}
