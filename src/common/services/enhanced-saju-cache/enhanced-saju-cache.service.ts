import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnhancedSajuCacheService {
  private cache: Map<string, any>;
  private readonly ttl: number;

  constructor(private readonly configService: ConfigService) {
    this.cache = new Map();
    this.ttl = this.configService.get('cache.ttl');
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.ttl);
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
