import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

// PrismaService는 데이터베이스와의 연결을 관리하고, 트랜잭션 처리, 오류 로깅을 수행합니다.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // PrismaService 클래스에서 사용할 로그 설정
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('Database URL is not configured');
    }

    // 부모 클래스 PrismaClient 초기화 및 환경설정
    super({
      datasources: {
        db: { url: databaseUrl },
      },
      log:
        configService.get('NODE_ENV') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
      errorFormat: 'pretty',
    });
  }

  // 서비스가 시작될 때 데이터베이스에 연결합니다.
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  // 서비스가 종료될 때 데이터베이스 연결을 해제합니다.
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from database', error);
      throw error;
    }
  }

  // 테스트 환경에서 데이터베이스를 초기화 (데이터 삭제)
  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') !== 'test') {
      throw new Error('Database cleaning is only allowed in test environment');
    }

    try {
      const modelNames = Reflect.ownKeys(this)
        .filter((key) => typeof key === 'string') // string 타입의 키만 유지
        .filter(
          (key) => typeof this[key] === 'object' && 'deleteMany' in this[key],
        ); // deleteMany가 있는지 확인

      return await this.$transaction(
        modelNames.map((modelName) =>
          this[modelName as keyof typeof this].deleteMany(),
        ),
      );
    } catch (error) {
      this.logger.error('Failed to clean database', error);
      throw error;
    }
  }

  // 지정된 작업을 트랜잭션으로 실행하고, 시간 초과 옵션 추가
  async executeInTransaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    timeout: number = 5000,
  ): Promise<T> {
    return this.$transaction(
      async (prisma) => {
        try {
          return await fn(prisma);
        } catch (error) {
          this.logger.error('Transaction failed', error);
          throw error;
        }
      },
      {
        timeout,
        maxWait: timeout,
        isolationLevel: 'Serializable',
      },
    );
  }

  // 데이터베이스 연결 상태 확인 메서드
  async isConnected(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.warn('Database connection check failed', error);
      return false;
    }
  }

  // 재시도 로직을 추가하여 불안정한 작업에 대해 자동으로 재시도 수행
  async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        // 모든 재시도가 실패한 경우
        if (i === retries - 1) {
          this.logger.error(`All ${retries} retries failed`, error);
          throw error;
        }

        // 재시도 전에 대기 시간 적용 (2^i초씩 증가)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i)),
        );
        this.logger.warn(`Retry attempt ${i + 1} of ${retries}`);
      }
    }
    throw new Error('All retries failed');
  }
}
