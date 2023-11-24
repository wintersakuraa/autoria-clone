import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { StatisticsService } from '@modules/statistics/statistics.service';

@Injectable()
export class IncrementViewsMiddleware implements NestMiddleware {
  constructor(private readonly statisticsService: StatisticsService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const id = req.params.id;

    if (id) {
      await this.statisticsService.incrementViews(id);
    }

    next();
  }
}
