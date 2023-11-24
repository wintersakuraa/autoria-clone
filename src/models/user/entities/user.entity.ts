import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import { CarListing } from '@models/car-listing/entities/car-listing.entity';

import { AccountType, Role } from '../user.enums';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column({ default: null, nullable: true })
  @Exclude()
  refreshToken?: string;

  @ApiProperty()
  @Column({ default: false })
  isBlocked: boolean;

  @ApiProperty({ enum: Role })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.BUYER,
  })
  role: Role;

  @ApiProperty({ enum: AccountType })
  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.BASIC,
  })
  accountType: AccountType;

  @ApiProperty({ type: () => CarListing, isArray: true })
  @OneToMany(() => CarListing, (carListings) => carListings.user)
  carListings: CarListing[];
}
