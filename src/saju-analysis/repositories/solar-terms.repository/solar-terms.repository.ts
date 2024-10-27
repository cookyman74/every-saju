// src/saju-analysis/repositories/solar-terms.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { SolarTerm } from '@prisma/client';

@Injectable()
export class SolarTermsRepository extends BaseRepository<SolarTerm> {
  constructor(prisma: PrismaService) {
    super(prisma, 'solarTerm');
  }

  async findByDate(date: Date): Promise<SolarTerm | null> {
    // 날짜에 해당하는 절기 찾기
    const solarDegree = this.calculateSolarDegree(date);
    return this.prisma.solarTerm.findFirst({
      where: {
        startDegree: {
          lte: solarDegree,
        },
      },
      orderBy: {
        startDegree: 'desc',
      },
      include: {
        element: true,
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SolarTerm[]> {
    const startDegree = this.calculateSolarDegree(startDate);
    const endDegree = this.calculateSolarDegree(endDate);

    return this.prisma.solarTerm.findMany({
      where: {
        startDegree: {
          gte: startDegree,
          lte: endDegree,
        },
      },
      include: {
        element: true,
      },
      orderBy: {
        startDegree: 'asc',
      },
    });
  }

  async findByName(name: string): Promise<SolarTerm | null> {
    return this.prisma.solarTerm.findFirst({
      where: {
        OR: [{ name }, { koreanName: name }],
      },
      include: {
        element: true,
      },
    });
  }

  private calculateSolarDegree(date: Date): number {
    // 태양의 황경도 계산 로직
    // 실제 구현시에는 천문학적 계산 라이브러리 사용 권장
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    return (dayOfYear * 360) / 365.25;
  }
}
