import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNameDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;
}
