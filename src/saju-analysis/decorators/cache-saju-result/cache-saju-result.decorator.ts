import { applyDecorators, SetMetadata } from '@nestjs/common';

export const CACHE_SAJU_KEY = 'CACHE_SAJU';

export interface CacheSajuOptions {
  ttl?: number;
  group?: string;
}

export const CacheSajuResult = (options?: CacheSajuOptions) =>
  applyDecorators(SetMetadata(CACHE_SAJU_KEY, options || {}));
