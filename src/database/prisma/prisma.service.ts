import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

// todo : 검토중
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log:
        configService.get('NODE_ENV') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') !== 'test') {
      throw new Error('Database cleaning is only allowed in test environment');
    }

    // 모든 테이블을 트랜잭션으로 정리
    const modelNames = Reflect.ownKeys(this).filter((key) => {
      return (
        key[0] !== '_' && typeof this[key] === 'object' && this[key].deleteMany
      );
    });

    return await this.$transaction(
      modelNames.map((modelName) => this[modelName].deleteMany()),
    );
  }

  // 트랜잭션 헬퍼 메서드
  async executeInTransaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      return await fn(prisma);
    });
  }
}
