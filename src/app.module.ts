import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { dbConfig, loggerConfig } from '@/configs';

import { AccessTokenGuard } from '@common/guards';
import {
  IncrementViewsMiddleware,
  LoggerMiddleware,
} from '@common/middlewares';
import { BrandModule } from '@models/brand/brand.module';
import { CarListingModule } from '@models/car-listing/car-listing.module';
import { CarListing } from '@models/car-listing/entities/car-listing.entity';
import { CarModelModule } from '@models/car-model/car-model.module';
import { UserModule } from '@models/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { StatisticsModule } from '@modules/statistics/statistics.module';
import { StatisticsService } from '@modules/statistics/statistics.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CarListingModule,
    CarModelModule,
    BrandModule,
    StatisticsModule,
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([CarListing]),
    LoggerModule.forRoot(loggerConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    StatisticsService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(IncrementViewsMiddleware)
      .forRoutes({ path: 'car-listings/:id', method: RequestMethod.GET });
  }
}
