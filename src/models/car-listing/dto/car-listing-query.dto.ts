import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { BaseQueryDto } from '@common/dto';

import { Region } from '../car-listings.enums';

export class CarListingQueryDto extends BaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  modelId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  brandId: string;

  @ApiProperty({ enum: Region, isArray: true, required: false })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(Region, { each: true })
  regions: Region[];
}
