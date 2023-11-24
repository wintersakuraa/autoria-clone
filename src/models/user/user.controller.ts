import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { ReqUser } from '@common/decorators';
import { BaseQueryDto } from '@common/dto';
import { RoleGuard } from '@common/guards';
import { PaginationResponse, RequestUser } from '@common/types/http.types';

import { AssignRoleDto, BlockDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { Role } from './user.enums';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth('jwt-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get authenticated user' })
  @Get('me')
  getMe(@ReqUser() user: RequestUser): Promise<User> {
    return this.userService.getById(user.id);
  }

  @ApiOperation({ summary: 'Update authenticated user' })
  @Patch()
  update(
    @ReqUser() user: RequestUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userService.update(user.id, dto);
  }

  @ApiOperation({ summary: 'Assign role to user' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Patch(':assigneeId/assign-role')
  assignRole(
    @ReqUser() user: RequestUser,
    @Param('assigneeId', ParseUUIDPipe) assigneeId: string,
    @Body() dto: AssignRoleDto,
  ): Promise<void> {
    return this.userService.assignRole(user.role, assigneeId, dto);
  }

  @ApiOperation({ summary: 'Block/unblock user' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Patch(':blockUserId/block')
  block(
    @ReqUser() user: RequestUser,
    @Param('blockUserId', ParseUUIDPipe) blockUserId: string,
    @Body() dto: BlockDto,
  ): Promise<void> {
    return this.userService.toggleBlock(user.role, blockUserId, dto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Get()
  getAll(@Query() query: BaseQueryDto): Promise<PaginationResponse<User[]>> {
    return this.userService.getAll(query);
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(RoleGuard([Role.MANAGER, Role.ADMIN]))
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
