// src/saju-analysis/repositories/interpretation.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { InterpretationPattern, Interpretation } from '@prisma/client';

@Injectable()
export class InterpretationRepository extends BaseRepository<InterpretationPattern> {
  constructor(prisma: PrismaService) {
    // 기본 레포지토리 기능을 위해 PrismaService와 모델 이름 설정
    super(prisma, 'interpretationPattern');
  }

  /**
   * 조건에 맞는 활성화된 해석 패턴을 찾는 메서드
   * @param conditions 패턴 조건 (조건이 일치하는 패턴들을 조회)
   */
  async findMatchingPatterns(
    conditions: any,
  ): Promise<InterpretationPattern[]> {
    return this.prisma.interpretationPattern.findMany({
      where: {
        isActive: true, // 활성화된 패턴만 조회
        conditions: {
          path: ['$'],
          array_contains: conditions,
        },
      },
      include: {
        category: true, // 카테고리 정보 포함
      },
      orderBy: {
        weight: 'desc', // 가중치 높은 순서로 정렬
      },
    });
  }

  /**
   * 특정 카테고리에 속하는 모든 활성화된 해석 패턴을 찾는 메서드
   * @param categoryId 검색할 카테고리 ID
   */
  async findByCategoryId(categoryId: string): Promise<InterpretationPattern[]> {
    return this.prisma.interpretationPattern.findMany({
      where: {
        categoryId, // 지정된 카테고리 ID와 일치
        isActive: true,
      },
      include: {
        category: true, // 카테고리 정보 포함
      },
    });
  }

  /**
   * 해석 결과를 저장하는 메서드
   * @param data 저장할 해석 정보 (사주 기둥 ID, 패턴 ID 등 포함)
   */
  async saveInterpretation(data: {
    sajuPillarId: string;
    patternId: string;
    content: string;
    confidence: number;
  }): Promise<Interpretation> {
    return this.prisma.interpretation.create({
      data: {
        sajuPillar: { connect: { id: data.sajuPillarId } }, // 사주 기둥 연결
        pattern: { connect: { id: data.patternId } }, // 패턴 연결
        content: data.content, // 해석 내용
        confidence: data.confidence, // 신뢰도 설정
      },
      include: {
        pattern: true, // 패턴 정보 포함
        sajuPillar: true, // 사주 기둥 정보 포함
      },
    });
  }

  /**
   * 최소 가중치 조건에 맞는 활성화된 해석 패턴들을 찾는 메서드
   * @param minWeight 최소 가중치 (기본값은 0)
   */
  async findActivePatternsByWeight(
    minWeight: number = 0,
  ): Promise<InterpretationPattern[]> {
    return this.prisma.interpretationPattern.findMany({
      where: {
        isActive: true,
        weight: {
          gte: minWeight, // 최소 가중치 조건 적용
        },
      },
      orderBy: {
        weight: 'desc', // 가중치 높은 순서로 정렬
      },
      include: {
        category: true, // 카테고리 정보 포함
      },
    });
  }

  /**
   * 특정 사주 기둥의 해석 기록을 불러오는 메서드
   * @param sajuPillarId 조회할 사주 기둥 ID
   */
  async getInterpretationHistory(
    sajuPillarId: string,
  ): Promise<Interpretation[]> {
    return this.prisma.interpretation.findMany({
      where: {
        sajuPillarId, // 특정 사주 기둥 ID와 일치
      },
      include: {
        pattern: {
          include: {
            category: true, // 각 패턴의 카테고리 정보 포함
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신 순서로 정렬
      },
    });
  }
}
