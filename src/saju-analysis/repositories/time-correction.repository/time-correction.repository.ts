// src/saju-analysis/repositories/time-correction.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { TimeCorrection } from '@prisma/client';

@Injectable()
export class TimeCorrectionRepository extends BaseRepository<TimeCorrection> {
  constructor(prisma: PrismaService) {
    super(prisma, 'timeCorrection');
  }

  async findBySolarTerm(solarTermId: string): Promise<TimeCorrection[]> {
    return this.prisma.timeCorrection.findMany({
      where: {
        solarTermId,
      },
      include: {
        solarTerm: true,
      },
      orderBy: {
        timeRange: 'asc',
      },
    });
  }

  async findByTimeRange(timeRange: {
    start: number;
    end: number;
  }): Promise<TimeCorrection[]> {
    return this.prisma.timeCorrection.findMany({
      where: {
        timeRange: {
          path: ['$.start'],
          lte: timeRange.end,
        },
        AND: {
          timeRange: {
            path: ['$.end'],
            gte: timeRange.start,
          },
        },
      },
      include: {
        solarTerm: true,
      },
    });
  }

  async findByLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<TimeCorrection[]> {
    // 위치 기반 시간 보정 찾기
    const baseCorrection = await this.calculateBaseCorrection(location);

    return this.prisma.timeCorrection.findMany({
      where: {
        correctionValue: {
          gte: baseCorrection - 1,
          lte: baseCorrection + 1,
        },
      },
      include: {
        solarTerm: true,
      },
    });
  }

  private async calculateBaseCorrection(location: {
    latitude: number;
    longitude: number;
  }): Promise<number> {
    // 위치 기반 기본 시간 보정값 계산
    // 경도 1도당 4분의 시간차 발생
    const standardLongitude = 120; // 한국 표준시 기준 경도
    const timeDifference = (location.longitude - standardLongitude) * 4;
    return timeDifference;
  }
}
