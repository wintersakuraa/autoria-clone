import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import { ColumnNumericTransformer } from '@common/transformers';
import { Brand } from '@models/brand/entities/brand.entity';
import { CarModel } from '@models/car-model/entities/car-model.entity';
import { User } from '@models/user/entities/user.entity';

import { Currency, Region } from '../car-listings.enums';

@Entity()
export class CarListing extends BaseEntity {
  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  image?: string;

  @ApiProperty({ enum: Region })
  @Column({
    type: 'enum',
    enum: Region,
  })
  region: Region;

  @ApiProperty()
  @Column()
  year: number;

  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @ApiProperty({ enum: Currency })
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.UAH,
  })
  currency: Currency;

  @ApiProperty()
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty()
  @Column({ default: 0 })
  editCount: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 0 })
  dailyViews: number;

  @Column({ default: 0 })
  weeklyViews: number;

  @Column({ default: 0 })
  monthlyViews: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.carListings, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: () => Brand })
  @ManyToOne(() => Brand, (brand) => brand.carListings)
  brand: Brand;

  @ApiProperty({ type: () => CarModel })
  @ManyToOne(() => CarModel, (model) => model.carListings)
  model: CarModel;
}
