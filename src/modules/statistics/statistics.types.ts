import { CarListing } from '@models/car-listing/entities/car-listing.entity';

export type CarListingStatistics = Pick<
  CarListing,
  'id' | 'region' | 'totalViews' | 'dailyViews' | 'weeklyViews' | 'monthlyViews'
> & {
  averagePriceByRegion: number;
  averagePriceInUkraine: number;
};
