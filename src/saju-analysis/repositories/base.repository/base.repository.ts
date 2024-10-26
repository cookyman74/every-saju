import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly modelName: string,
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({
      where: { id },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    return this.prisma[this.modelName].findMany(params);
  }

  async create(data: any): Promise<T> {
    return this.prisma[this.modelName].create({
      data,
    });
  }

  async update(id: string, data: any): Promise<T> {
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.prisma[this.modelName].delete({
      where: { id },
    });
  }
}
