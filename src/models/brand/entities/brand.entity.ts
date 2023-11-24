import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import { CarListing } from '@models/car-listing/entities/car-listing.entity';
import { CarModel } from '@models/car-model/entities/car-model.entity';

@Entity()
export class Brand extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => CarModel, isArray: true })
  @OneToMany(() => CarModel, (carModel) => carModel.brand)
  carModels: CarModel[];

  @ApiProperty({ type: () => CarListing, isArray: true })
  @OneToMany(() => CarListing, (carListings) => carListings.brand)
  carListings: CarListing[];
}
