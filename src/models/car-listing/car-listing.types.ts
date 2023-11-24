import { ResponseMetaWrapper } from '@common/types/http.types';
import { AccountType, Role } from '@models/user/user.enums';
import { PriceInCurrencies } from '@modules/currency/currency.types';

import { CarListing } from './entities/car-listing.entity';

export interface UserWithCarListingsCount {
  id: string;
  is_blocked: boolean;
  role: Role;
  account_type: AccountType;
  listings_count: string;
}

export interface CarListingMeta {
  prices?: PriceInCurrencies;
  message?: string;
}

export type CarListingWithMeta = ResponseMetaWrapper<
  CarListing,
  CarListingMeta
>;
