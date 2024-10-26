import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { BaseRepository } from '../base.repository/base.repository';
import { InterpretationPattern } from '@prisma/client';

@Injectable()
export class InterpretationRepository extends BaseRepository<InterpretationPattern> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'interpretationPattern');
  }

  async findMatchingPatterns(
    conditions: any,
  ): Promise<InterpretationPattern[]> {
    return this.prisma.interpretationPattern.findMany({
      where: {
        isActive: true,
        conditions: {
          path: '$',
          array_contains: conditions,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        weight: 'desc',
      },
    });
  }

  async findByCategoryId(categoryId: string): Promise<InterpretationPattern[]> {
    return this.prisma.interpretationPattern.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });
  }
}
