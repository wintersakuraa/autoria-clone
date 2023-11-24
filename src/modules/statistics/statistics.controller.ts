import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccountTypeGuard } from '@common/guards';
import { AccountType } from '@models/user/user.enums';

import { StatisticsService } from './statistics.service';
import { CarListingStatistics } from './statistics.types';

@ApiTags('statistics')
@ApiBearerAuth('jwt-auth')
@UseGuards(AccountTypeGuard(AccountType.PREMIUM))
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get car listing statistics' })
  @Get(':id')
  getInfo(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CarListingStatistics> {
    return this.statisticsService.getListingInfo(id);
  }
}
