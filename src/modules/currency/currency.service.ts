import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { PRIVAT_API_URL } from '@common/constants/http.constants';
import { UKRAINE_TIME_ZONE } from '@common/constants/time.constants';
import { currentDateToDDMMYYYY } from '@common/helpers/date.helpers';
import { Currency } from '@models/car-listing/car-listings.enums';
import { RedisKey } from '@modules/redis/redis.enums';
import { RedisService } from '@modules/redis/redis.service';

import {
  PriceInCurrencies,
  PrivatExchangeRate,
  RateResponse,
} from './currency.types';

@Injectable()
export class CurrencyService {
  private logger = new Logger(CurrencyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: UKRAINE_TIME_ZONE,
  })
  async updateCurrencyRates() {
    const rates = await this.fetchCurrencyCourse();
    await this.redisService.set<PrivatExchangeRate[]>(
      RedisKey.EXCHANGE_RATE,
      rates,
    );
  }

  async calculatePrices(
    price: number,
    currency: Currency,
  ): Promise<PriceInCurrencies> {
    const bankRates = await this.getCurrencyRates();
    const basePrice = this.getBasePrice(price, currency, bankRates);

    const ratesResponse: RateResponse[] = bankRates.map(
      (rate: PrivatExchangeRate) => ({
        baseCurrency: rate.baseCurrency,
        currency: rate.currency,
        exchangeRate: rate.purchaseRateNB,
      }),
    );

    const pricesInCurrencies: PriceInCurrencies = {
      originalPrice: price,
      originalCurrency: currency,
      prices: {
        UAH: basePrice,
        USD: basePrice / this.getRateByCurrency(bankRates, Currency.USD),
        EUR: basePrice / this.getRateByCurrency(bankRates, Currency.EUR),
      },
      rates: ratesResponse,
    };

    return pricesInCurrencies;
  }

  async convertPrice(
    price: number,
    currency: Currency,
    targetCurrency: Currency,
  ): Promise<number> {
    if (currency === targetCurrency) return price;

    const bankRates = await this.getCurrencyRates();
    const basePrice = this.getBasePrice(price, currency, bankRates);
    const targetRate = this.getRateByCurrency(bankRates, targetCurrency);

    const newPrice = basePrice / targetRate;
    return newPrice;
  }

  private async getCurrencyRates(): Promise<PrivatExchangeRate[]> {
    const cachedRates = await this.redisService.get<PrivatExchangeRate[]>(
      RedisKey.EXCHANGE_RATE,
    );

    if (!cachedRates) {
      const rates = await this.fetchCurrencyCourse();
      await this.redisService.set<PrivatExchangeRate[]>(
        RedisKey.EXCHANGE_RATE,
        rates,
      );

      return rates;
    }

    return cachedRates;
  }

  private async fetchCurrencyCourse(): Promise<PrivatExchangeRate[]> {
    const date = currentDateToDDMMYYYY();
    const url = `${PRIVAT_API_URL}/exchange_rates?json&date=${date}`;

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw error;
        }),
      ),
    );

    const exchangeRate: PrivatExchangeRate[] = data?.exchangeRate?.filter(
      (rate: PrivatExchangeRate) => rate.currency in Currency,
    );

    return exchangeRate;
  }

  private getRateByCurrency(
    bankRates: PrivatExchangeRate[],
    targetCurrency: Currency,
  ): number {
    const rate = bankRates.find(
      (rate: PrivatExchangeRate) => rate.currency === targetCurrency,
    );
    return rate.saleRateNB;
  }

  private getBasePrice(
    price: number,
    currency: Currency,
    bankRates: PrivatExchangeRate[],
  ): number {
    let basePrice: number;

    if (currency === Currency.UAH) {
      basePrice = price;
    } else {
      const targetCurrency =
        currency === Currency.USD ? Currency.USD : Currency.EUR;
      const rate = this.getRateByCurrency(bankRates, targetCurrency);
      basePrice = price * rate;
    }

    return basePrice;
  }
}
