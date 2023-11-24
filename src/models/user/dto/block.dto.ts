import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class BlockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  block: boolean;
}
