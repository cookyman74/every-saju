// PrismaClient는 데이터베이스와 연결하기 위해 사용합니다.
import { PrismaClient } from '@prisma/client';

export interface IRepository<T> {
  // 데이터를 찾으면 반환하고, 없으면 null을 반환합니다.
  find(id: string): Promise<T | null>;
  // - skip: 건너뛸 데이터 개수를 설정합니다.
  // - take: 가져올 데이터 개수를 설정합니다.
  findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]>;

  create(data: any): Promise<T>;
}
