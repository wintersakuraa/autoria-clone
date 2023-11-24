import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public, ReqUser } from '@common/decorators';
import { RefreshTokenGuard } from '@common/guards';
import { RequestUser } from '@common/types/http.types';
import { RefreshDto } from '@modules/auth/dto/refresh.dto';

import { AuthService } from './auth.service';
import { Tokens } from './auth.types';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('auth')
@ApiBearerAuth('jwt-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login' })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Logout' })
  @Get('logout')
  async logout(@ReqUser() user: RequestUser): Promise<void> {
    return this.authService.logout(user.id);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @UseGuards(RefreshTokenGuard)
  @Public()
  @Post('refresh')
  refreshTokens(@Body() dto: RefreshDto): Promise<Tokens> {
    return this.authService.refreshTokens(dto);
  }
}
