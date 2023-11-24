import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UpdateNameDto } from '@common/dto';
import { ModelNotFoundException } from '@common/exceptions';
import { getSkip } from '@common/helpers/util.helpers';
import { PaginationResponse } from '@common/types/http.types';

import { CarModelQueryDto, CreateCarModelDto } from './dto';

import { CarModel } from '../car-model/entities/car-model.entity';

@Injectable()
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
  ) {}

  create(dto: CreateCarModelDto): Promise<CarModel> {
    return this.carModelRepository.save({
      ...dto,
      brand: {
        id: dto.brandId,
      },
    });
  }

  async getAll(
    query: CarModelQueryDto,
  ): Promise<PaginationResponse<CarModel[]>> {
    const { page, limit, brandId } = query;
    const skip = getSkip(page, limit);

    const getAllQuery = this.carModelRepository
      .createQueryBuilder('models')
      .leftJoin('models.brand', 'brand')
      .addSelect('brand.id')
      .skip(skip)
      .take(limit);

    if (brandId) getAllQuery.andWhere('brand.id = :brandId', { brandId });

    const [data, total] = await getAllQuery.getManyAndCount();

    return {
      total,
      data,
    };
  }

  async getById(id: string) {
    const model = await this.carModelRepository.findOne({ where: { id } });
    if (!model) throw new ModelNotFoundException('Car model');

    return model;
  }

  update(id: string, dto: UpdateNameDto) {
    return this.carModelRepository.update(id, dto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.carModelRepository.delete(id);
  }
}
