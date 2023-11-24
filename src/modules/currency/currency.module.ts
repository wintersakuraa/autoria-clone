import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RedisModule } from '@modules/redis/redis.module';

import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpModule, RedisModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
