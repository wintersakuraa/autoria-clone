import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateNameDto } from '@common/dto';

export class CreateCarModelDto extends CreateNameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brandId: string;
}
