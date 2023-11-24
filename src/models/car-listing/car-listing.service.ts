import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import {
  AccessDeniedException,
  ModelNotFoundException,
} from '@common/exceptions';
import { getDescriptionValidationMessage } from '@common/helpers/message.helpers';
import { getSkip } from '@common/helpers/util.helpers';
import { isSupervisor, isValidText } from '@common/helpers/validation.helpers';
import { PaginationResponse } from '@common/types/http.types';
import { Brand } from '@models/brand/entities/brand.entity';
import {
  CarListingQueryDto,
  CreateCarListingDto,
} from '@models/car-listing/dto';
import { UpdateCarListingDto } from '@models/car-listing/dto/update-car-listing.dto';
import { CarModel } from '@models/car-model/entities/car-model.entity';
import { User } from '@models/user/entities/user.entity';
import { AccountType } from '@models/user/user.enums';
import { CurrencyService } from '@modules/currency/currency.service';
import { FileItemType } from '@modules/s3/s3.enums';
import { S3Service } from '@modules/s3/s3.service';

import {
  CarListingWithMeta,
  UserWithCarListingsCount,
} from './car-listing.types';
import { CarListing } from './entities/car-listing.entity';
import {
  BasicAccountLimitException,
  BrandMismatchException,
  EditCountLimitException,
  UserBlockedException,
} from './exceptions';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    private readonly currencyService: CurrencyService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    userId: string,
    dto: CreateCarListingDto,
  ): Promise<CarListing | CarListingWithMeta> {
    const { description, modelId, brandId } = dto;
    const { user, model, brand } = await this.validateListingCreation(
      userId,
      modelId,
      brandId,
    );

    const isValidDescription = isValidText(description);

    const carListing = await this.carListingRepository.save({
      ...dto,
      user: { id: user.id },
      model,
      brand,
      isActive: isValidDescription,
    });

    return {
      ...carListing,
      ...(!isValidDescription && {
        meta: {
          message: getDescriptionValidationMessage(0),
        },
      }),
    };
  }

  async getAll(
    query: CarListingQueryDto,
  ): Promise<PaginationResponse<CarListing[]>> {
    const { page, limit, regions, userId, modelId, brandId } = query;
    const skip = getSkip(page, limit);

    const getAllQuery = this.getCarListingsWithRelations()
      .skip(skip)
      .take(limit);

    if (userId) getAllQuery.andWhere('user.id = :userId', { userId });
    if (modelId) getAllQuery.andWhere('model.id = :modelId', { modelId });
    if (brandId) getAllQuery.andWhere('brand.id = :brandId', { brandId });

    if (regions?.length) {
      getAllQuery.andWhere('listings.region IN (:...regions)', { regions });
    }

    const [data, total] = await getAllQuery.getManyAndCount();

    return {
      total,
      data,
    };
  }

  async getById(id: string): Promise<CarListingWithMeta> {
    const carListing = await this.getCarListingsWithRelations()
      .andWhere('listings.id = :id', { id })
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    const prices = await this.currencyService.calculatePrices(
      carListing.price,
      carListing.currency,
    );

    return {
      ...carListing,
      meta: {
        prices,
      },
    };
  }

  async update(
    userId: string,
    listingId: string,
    dto: UpdateCarListingDto,
  ): Promise<UpdateResult> {
    const canUpdate = await this.canMutate(userId, listingId);
    if (!canUpdate) throw new AccessDeniedException();

    const carListing = await this.carListingRepository.findOneBy({
      id: listingId,
    });

    const updateDto = { ...dto };
    let isActive = carListing.isActive;
    let editCount = carListing.editCount;

    if (dto?.currency && !dto?.price) {
      const newPrice = await this.currencyService.convertPrice(
        carListing.price,
        carListing.currency,
        dto.currency,
      );

      updateDto.price = newPrice;
    }

    if (dto?.description) {
      if (carListing.editCount > 3) {
        await this.carListingRepository.delete(listingId);
        throw new EditCountLimitException();
      }

      isActive = isValidText(dto.description);
      !isActive && editCount++;
    }

    const updateResult = await this.carListingRepository.update(listingId, {
      ...updateDto,
      isActive,
      editCount,
    });

    return {
      ...updateResult,
      ...(!isActive && {
        meta: {
          message: getDescriptionValidationMessage(carListing.editCount),
        },
      }),
    };
  }

  async delete(userId: string, listingId: string): Promise<DeleteResult> {
    const canDelete = await this.canMutate(userId, listingId);
    if (!canDelete) throw new AccessDeniedException();

    const carListing = await this.carListingRepository
      .createQueryBuilder('listings')
      .where('listings.id = :listingId', { listingId })
      .select(['listings.id', 'listings.image'])
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    if (carListing.image) {
      await this.s3Service.delete(carListing.image);
    }

    return this.carListingRepository.delete(listingId);
  }

  async getPricesInCurrencies(id: string) {
    const carListing = await this.carListingRepository
      .createQueryBuilder('listings')
      .where('listings.id = :id', { id })
      .select(['listings.id', 'listings.currency', 'listings.price'])
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    const prices = await this.currencyService.calculatePrices(
      carListing.price,
      carListing.currency,
    );

    return prices;
  }

  async upload(id: string, file: Express.Multer.File): Promise<UpdateResult> {
    const carListing = await this.carListingRepository
      .createQueryBuilder('listings')
      .where('listings.id = :id', { id })
      .select(['listings.id', 'listings.image'])
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    if (carListing.image) {
      await this.s3Service.delete(carListing.image);
    }

    const filePath = await this.s3Service.upload(file, FileItemType.CAR, id);
    return this.carListingRepository.update(id, { image: filePath });
  }

  private async canMutate(userId: string, listingId: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const carListing = await this.carListingRepository
      .createQueryBuilder('listing')
      .where('listing.id = :listingId', { listingId })
      .leftJoin('listing.user', 'user')
      .addSelect('user.id')
      .getOne();

    if (!carListing) throw new ModelNotFoundException('Car listing');

    const isListingOwner = userId === carListing.user.id;

    return isSupervisor(user.role) || isListingOwner;
  }

  private async validateListingCreation(
    userId: string,
    modelId: string,
    brandId: string,
  ): Promise<{
    user: UserWithCarListingsCount;
    model: CarModel;
    brand: Brand;
  }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.carListings', 'listings')
      .where('user.id = :userId', { userId })
      .select([
        'user.id as id',
        'user.role as role',
        'user.isBlocked as is_blocked',
        'user.accountType as account_type',
        'COUNT(listings.id) as listings_count',
      ])
      .addGroupBy('user.id')
      .getRawOne<UserWithCarListingsCount>();

    if (!user) throw new ModelNotFoundException('User');
    if (user.is_blocked) throw new UserBlockedException();
    if (
      user.account_type === AccountType.BASIC &&
      Number(user.listings_count) >= 1
    ) {
      throw new BasicAccountLimitException();
    }

    const brand = await this.brandRepository.findOneBy({ id: brandId });
    if (!brand) throw new ModelNotFoundException('Brand');

    const model = await this.carModelRepository
      .createQueryBuilder('models')
      .where('models.id = :modelId', { modelId })
      .leftJoin('models.brand', 'brand')
      .addSelect('brand.id')
      .getOne();

    if (!model) throw new ModelNotFoundException('Car model');

    if (brandId !== model.brand.id) throw new BrandMismatchException();

    return {
      user,
      model,
      brand,
    };
  }

  private getCarListingsWithRelations(): SelectQueryBuilder<CarListing> {
    const query = this.carListingRepository
      .createQueryBuilder('listings')
      .leftJoin('listings.model', 'model')
      .leftJoin('listings.brand', 'brand')
      .leftJoin('listings.user', 'user')
      .select([
        'listings.id',
        'listings.price',
        'listings.image',
        'listings.currency',
        'listings.region',
        'listings.description',
        'listings.createdAt',
        'listings.isActive',
        'user.id',
        'user.email',
        'user.phone',
        'user.username',
        'user.isBlocked',
        'model.id',
        'model.name',
        'brand.id',
        'brand.name',
      ])
      .andWhere('user.isBlocked = false')
      .andWhere('listings.isActive = true');

    return query;
  }
}
