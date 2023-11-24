import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { BaseQueryDto, CreateNameDto, UpdateNameDto } from '@common/dto';
import { ModelNotFoundException } from '@common/exceptions';
import { getSkip } from '@common/helpers/util.helpers';
import { PaginationResponse } from '@common/types/http.types';
import { Brand } from '@models/brand/entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  create(dto: CreateNameDto): Promise<Brand> {
    return this.brandRepository.save(dto);
  }

  async getAll(query: BaseQueryDto): Promise<PaginationResponse<Brand[]>> {
    const { page, limit } = query;
    const skip = getSkip(page, limit);

    const [data, total] = await this.brandRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      total,
      data,
    };
  }

  async getById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new ModelNotFoundException('Car brand');

    return brand;
  }

  update(id: string, dto: UpdateNameDto): Promise<UpdateResult> {
    return this.brandRepository.update(id, dto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.brandRepository.delete(id);
  }
}
