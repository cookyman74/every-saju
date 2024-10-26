import { AppConfig } from './interfaces/config.interface';

export default (): AppConfig => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'saju_db',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600,
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS, 10) || 100,
  },
  security: {
    apiKey: process.env.API_KEY || 'default-api-key',
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
      limit: parseInt(process.env.RATE_LIMIT, 10) || 100,
    },
  },
});
