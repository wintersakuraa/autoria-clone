import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { redisConfig } from '@/configs';

import { RedisKey } from './redis.enums';

@Injectable()
export class RedisService {
  private readonly redisClient = new Redis(redisConfig);

  async get<T = any>(key: RedisKey): Promise<T> {
    const cachedData = await this.redisClient.get(key);
    if (!cachedData) return null;

    return JSON.parse(cachedData);
  }

  async set<T = any>(key: RedisKey, data: T): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(data));
  }
}
