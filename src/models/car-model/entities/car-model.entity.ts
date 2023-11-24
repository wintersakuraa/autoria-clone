import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import { Brand } from '@models/brand/entities/brand.entity';
import { CarListing } from '@models/car-listing/entities/car-listing.entity';

@Entity()
export class CarModel extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => Brand })
  @ManyToOne(() => Brand, (brand) => brand.carModels)
  brand: Brand;

  @ApiProperty({ type: () => CarListing, isArray: true })
  @OneToMany(() => CarListing, (carListings) => carListings.model)
  carListings: CarListing[];
}
