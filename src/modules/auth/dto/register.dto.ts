import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { AccountType, Role } from '@models/user/user.enums';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UA')
  phone: string;

  @ApiProperty({ enum: Role, required: false })
  @IsIn([Role.BUYER, Role.SELLER])
  @IsOptional()
  role: Role.BUYER | Role.SELLER = Role.BUYER;

  @ApiProperty({ enum: AccountType, required: false })
  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType = AccountType.BASIC;
}
