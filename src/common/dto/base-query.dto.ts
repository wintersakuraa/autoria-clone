import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;
}
