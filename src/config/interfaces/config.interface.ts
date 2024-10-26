export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
}

export interface CacheConfig {
  ttl: number;
  maxItems: number;
}

export interface SecurityConfig {
  apiKey: string;
  rateLimit: {
    ttl: number;
    limit: number;
  };
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  cache: CacheConfig;
  security: SecurityConfig;
}
