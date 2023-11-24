import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UKRAINE_TIME_ZONE } from '@common/constants/time.constants';
import { ModelNotFoundException } from '@common/exceptions';
import { Region } from '@models/car-listing/car-listings.enums';
import { CarListing } from '@models/car-listing/entities/car-listing.entity';

import { CarListingStatistics } from './statistics.types';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(CarListing)
    private readonly carListingRepository: Repository<CarListing>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: UKRAINE_TIME_ZONE,
  })
  async resetDailyViews() {
    await this.resetField('dailyViews');
  }

  @Cron(CronExpression.EVERY_WEEK, {
    timeZone: UKRAINE_TIME_ZONE,
  })
  async resetWeeklyViews() {
    await this.resetField('weeklyViews');
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: UKRAINE_TIME_ZONE,
  })
  async resetMonthlyViews() {
    await this.resetField('monthlyViews');
  }

  async getListingInfo(id: string): Promise<CarListingStatistics> {
    const carListing = await this.carListingRepository
      .createQueryBuilder('listings')
      .where('listings.id = :id', { id })
      .select([
        'listings.id',
        'listings.region',
        'listings.totalViews',
        'listings.dailyViews',
        'listings.weeklyViews',
        'listings.monthlyViews',
      ])
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    const averagePriceByRegion = await this.getAveragePriceByRegion(
      carListing.region,
    );

    const averagePriceInUkraine = await this.getAveragePriceInUkraine();

    return {
      ...carListing,
      averagePriceByRegion,
      averagePriceInUkraine,
    };
  }

  async incrementViews(id: string): Promise<void> {
    const result = await this.carListingRepository
      .createQueryBuilder('listings')
      .select([
        'listings.totalViews as total',
        'listings.dailyViews as daily',
        'listings.weeklyViews as weekly',
        'listings.monthlyViews as monthly',
      ])
      .where('listings.id = :id', { id })
      .getRawOne();

    if (!result) throw new ModelNotFoundException('Car listing');

    const { total, daily, weekly, monthly } = result;
    const dto = {
      totalViews: total + 1,
      dailyViews: daily + 1,
      weeklyViews: weekly + 1,
      monthlyViews: monthly + 1,
    };

    await this.carListingRepository.update(id, dto);
  }

  private async getAveragePriceByRegion(region: Region): Promise<number> {
    const resultByRegion = await this.carListingRepository
      .createQueryBuilder('listings')
      .select('AVG(listings.price)', 'average_region_price')
      .where('listings.region = :region', { region })
      .getRawOne<{ average_region_price: string }>();

    return Number(resultByRegion.average_region_price);
  }

  private async getAveragePriceInUkraine(): Promise<number> {
    const resultInCounty = await this.carListingRepository
      .createQueryBuilder('listings')
      .select('AVG(listings.price)', 'average_price')
      .getRawOne<{ average_price: string }>();

    return Number(resultInCounty.average_price);
  }

  private resetField(fieldName: keyof CarListing) {
    const resetData: Partial<CarListing> = { [fieldName]: 0 };

    return this.carListingRepository
      .createQueryBuilder()
      .update(CarListing)
      .set(resetData)
      .execute();
  }
}
