import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { BaseQueryDto } from '@common/dto';

export class CarModelQueryDto extends BaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  brandId: string;
}
