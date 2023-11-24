import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { Repository } from 'typeorm';

import { jwtConfig } from '@/configs';

import {
  AccessDeniedException,
  ModelNotFoundException,
} from '@common/exceptions';
import { User } from '@models/user/entities/user.entity';
import { RefreshDto } from '@modules/auth/dto/refresh.dto';

import { JwtPayload, Tokens } from './auth.types';
import { LoginDto, RegisterDto } from './dto';
import {
  InvalidPasswordException,
  InvalidRefreshTokenException,
  UserAlreadyExistsException,
} from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<Tokens> {
    const { email, password } = registerDto;

    const candidate = await this.userRepository.findOne({ where: { email } });
    if (candidate) throw new UserAlreadyExistsException();

    const hashedPassword = await hash(password);

    const user = await this.userRepository.save({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new ModelNotFoundException('User');

    const passwordEquals = await verify(user.password, password);
    if (!passwordEquals) throw new InvalidPasswordException();

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async refreshTokens(dto: RefreshDto) {
    const { refreshToken } = dto;

    const payload = await this.jwtService.decode(refreshToken);
    if (!payload) throw new InvalidRefreshTokenException();

    const { sub: id } = payload;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.refreshToken) throw new AccessDeniedException();

    const refreshTokenMatches = await verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new AccessDeniedException();

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      accountType: user.accountType,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.atSecret,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.rtSecret,
        expiresIn: '7d',
      }),
    ]);

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
