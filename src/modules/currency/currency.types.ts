import { Currency } from '@models/car-listing/car-listings.enums';

export interface PrivatExchangeRate {
  baseCurrency: string;
  currency: string;
  saleRateNB: number;
  purchaseRateNB: number;
  saleRate: number;
  purchaseRate: number;
}

export type RateResponse = Pick<
  PrivatExchangeRate,
  'baseCurrency' | 'currency'
> & {
  exchangeRate: number;
};

export interface Prices {
  UAH: number;
  USD: number;
  EUR: number;
}

export interface PriceInCurrencies {
  originalPrice: number;
  originalCurrency: Currency;
  prices: Prices;
  rates: RateResponse[];
}
