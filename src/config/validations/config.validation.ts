import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  IsArray,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsArray()
  ALLOWED_ORIGINS: string[];

  @IsNumber()
  CACHE_TTL: number;

  @IsNumber()
  CACHE_MAX_ITEMS: number;

  @IsString()
  API_KEY: string;

  @IsNumber()
  RATE_LIMIT_TTL: number;

  @IsNumber()
  RATE_LIMIT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, {
    ...config,
    PORT: parseInt(config.PORT as string, 10),
    CACHE_TTL: parseInt(config.CACHE_TTL as string, 10),
    CACHE_MAX_ITEMS: parseInt(config.CACHE_MAX_ITEMS as string, 10),
    RATE_LIMIT_TTL: parseInt(config.RATE_LIMIT_TTL as string, 10),
    RATE_LIMIT: parseInt(config.RATE_LIMIT as string, 10),
    ALLOWED_ORIGINS: (config.ALLOWED_ORIGINS as string).split(','),
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
