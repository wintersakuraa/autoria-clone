import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { BaseQueryDto } from '@common/dto';
import {
  AccessDeniedException,
  ModelNotFoundException,
} from '@common/exceptions';
import { getSkip } from '@common/helpers/util.helpers';
import { isSupervisor } from '@common/helpers/validation.helpers';
import { PaginationResponse } from '@common/types/http.types';

import { AssignRoleDto, BlockDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { Role } from './user.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAll(query: BaseQueryDto): Promise<PaginationResponse<User[]>> {
    const { page, limit } = query;
    const skip = getSkip(page, limit);

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      total,
      data,
    };
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.carListings', 'carListings')
      .getOne();

    if (!user) throw new ModelNotFoundException('User');

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UpdateResult> {
    const updateDto = dto;

    if (dto?.password) {
      updateDto.password = await hash(dto.password);
    }

    return this.userRepository.update(id, updateDto);
  }

  async assignRole(
    authUserRole: Role,
    assigneeId: string,
    dto: AssignRoleDto,
  ): Promise<void> {
    const { role } = dto;
    this.checkRolePermissions(authUserRole, role);
    await this.userRepository.update(assigneeId, { role });
  }

  async toggleBlock(
    authUserRole: Role,
    blockUserId: string,
    blockDto: BlockDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: blockUserId });
    if (!user) throw new ModelNotFoundException('User');

    this.checkRolePermissions(authUserRole, user.role);

    await this.userRepository.update(blockUserId, {
      isBlocked: blockDto.block,
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  private checkRolePermissions(authUserRole: Role, userRole: Role): void {
    const canPerformAction =
      authUserRole === Role.MANAGER && isSupervisor(userRole);

    if (!canPerformAction) throw new AccessDeniedException();
  }
}
