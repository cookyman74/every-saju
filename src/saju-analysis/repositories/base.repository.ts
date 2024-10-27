import { PrismaService } from '../../database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IRepository } from './interfaces/repository.interface';

@Injectable()
export abstract class BaseRepository<T> implements IRepository<T> {
  // PrismaService와 모델 이름을 저장합니다.
  protected readonly prisma: PrismaService;
  protected readonly modelName: string;

  // 생성자: PrismaService와 모델 이름을 받아서 초기화합니다.
  constructor(prisma: PrismaService, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  // 특정 id로 데이터를 찾는 메서드
  async find(id: string): Promise<T | null> {
    // PrismaClient를 사용하여 데이터를 조회합니다.
    return this.prisma[this.modelName].findUnique({
      where: { id },
    });
  }

  // 여러 데이터를 찾는 메서드
  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    // 조건에 맞는 여러 데이터를 조회합니다.
    return this.prisma[this.modelName].findMany(params);
  }

  // 새로운 데이터를 생성하는 메서드
  async create(data: any): Promise<T> {
    // 전달받은 데이터로 새 항목을 만듭니다.
    return this.prisma[this.modelName].create({
      data,
    });
  }

  // 기존 데이터를 수정하는 메서드
  async update(id: string, data: any): Promise<T> {
    // 특정 id의 데이터를 업데이트합니다.
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    });
  }

  // 데이터를 삭제하는 메서드
  async delete(id: string): Promise<T> {
    // 특정 id의 데이터를 삭제합니다.
    return this.prisma[this.modelName].delete({
      where: { id },
    });
  }

  // 데이터 개수를 세는 메서드
  async count(where?: any): Promise<number> {
    // 조건에 맞는 데이터 개수를 반환합니다.
    return this.prisma[this.modelName].count({ where });
  }

  // 트랜잭션 내에서 작업을 실행하는 메서드
  protected async executeInTransaction<R>(
    operation: (prisma: PrismaService) => Promise<R>,
  ): Promise<R> {
    // 트랜잭션을 통해 여러 작업을 하나로 묶어 실행합니다.
    return this.prisma.executeInTransaction(operation);
  }
}
