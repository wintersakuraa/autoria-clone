import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
