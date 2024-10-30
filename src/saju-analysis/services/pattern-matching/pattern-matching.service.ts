// src/saju-analysis/services/pattern-matching.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InterpretationRepository } from '../../repositories/interpretation.repository/interpretation.repository';
import { EnhancedLoggingService } from '../../../common/services/enhanced-logging/enhanced-logging.service';
import { PatternMatchingRules } from '../../rules/pattern-matching.rules';
import {
  ISajuPillar,
  IPatternMatchResult,
  IMatchingCondition,
  InterpretationPattern,
} from '../../interfaces/';
import { PatternMatchingException } from '../../exceptions/pattern-matching.exception';

// 매칭 결과의 신뢰도 레벨 정의
export enum ConfidenceLevel {
  HIGH = 'HIGH', // 90% 이상
  MEDIUM = 'MEDIUM', // 70-90%
  LOW = 'LOW', // 50-70%
  VERY_LOW = 'VERY_LOW', // 50% 미만
}

// 패턴 매칭 옵션 인터페이스
export interface IPatternMatchingOptions {
  minConfidence?: number; // 최소 신뢰도
  maxResults?: number; // 최대 결과 수
  includeInactive?: boolean; // 비활성 패턴 포함 여부
}

@Injectable()
export class PatternMatchingService {
  private readonly logger = new Logger(PatternMatchingService.name);
  private readonly DEFAULT_MIN_CONFIDENCE: number;
  private readonly DEFAULT_MAX_RESULTS: number;
  private readonly LOG_PERFORMANCE_METRICS: boolean;

  constructor(
    private readonly interpretationRepo: InterpretationRepository,
    private readonly loggingService: EnhancedLoggingService,
    private readonly configService: ConfigService,
  ) {
    // 환경 변수에서 설정값 초기화
    this.DEFAULT_MIN_CONFIDENCE = this.configService.get<number>(
      'PATTERN_MIN_CONFIDENCE',
      50,
    );
    this.DEFAULT_MAX_RESULTS = this.configService.get<number>(
      'PATTERN_MAX_RESULTS',
      10,
    );
    this.LOG_PERFORMANCE_METRICS = this.configService.get<boolean>(
      'LOG_PERFORMANCE_METRICS',
      true,
    );
  }

  /**
   * 사주 데이터에 맞는 패턴을 찾아 매칭 결과를 반환
   * @param sajuPillar 사주 기둥 데이터
   * @param options 매칭 옵션
   */
  async findMatchingPatterns(
    sajuPillar: ISajuPillar,
    options: IPatternMatchingOptions = {},
  ): Promise<IPatternMatchResult[]> {
    try {
      const startTime = Date.now();
      const executionMetrics = {
        patternSearchTime: 0,
        scoreCalculationTime: 0,
        totalPatterns: 0,
        matchedPatterns: 0,
      };

      const {
        minConfidence = this.DEFAULT_MIN_CONFIDENCE,
        maxResults = this.DEFAULT_MAX_RESULTS,
        includeInactive = false,
      } = options;

      this.validateInput(sajuPillar);

      const conditions = this.createMatchingConditions(sajuPillar);
      const patternSearchStart = Date.now();

      const patterns =
        await this.interpretationRepo.findMatchingPatterns(conditions);
      executionMetrics.patternSearchTime = Date.now() - patternSearchStart;
      executionMetrics.totalPatterns = patterns.length;

      if (!patterns.length) {
        this.logger.warn('No matching patterns found', {
          sajuPillar,
          conditions,
          executionMetrics,
        });
        return [];
      }

      const scoreCalculationStart = Date.now();
      const matchResults = await Promise.all(
        patterns.map(async (pattern) => {
          const matchScore = await this.calculateMatchScore(
            pattern,
            sajuPillar,
          );
          const confidence = this.calculateConfidence(matchScore);

          return {
            pattern,
            matchScore,
            confidence,
            confidenceLevel: this.getConfidenceLevel(confidence),
          };
        }),
      );
      executionMetrics.scoreCalculationTime =
        Date.now() - scoreCalculationStart;

      const filteredResults = matchResults
        .filter((result) => result.confidence >= minConfidence)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, maxResults);

      executionMetrics.matchedPatterns = filteredResults.length;

      if (!this.validateResults(filteredResults)) {
        throw new PatternMatchingException(
          'Invalid pattern matching results detected',
        );
      }

      const duration = Date.now() - startTime;
      if (this.LOG_PERFORMANCE_METRICS) {
        this.loggingService.logAnalysis('PATTERN_MATCHING', {
          level: 'DEBUG',
          operation: 'pattern_matching',
          metrics: {
            totalDuration: duration,
            ...executionMetrics,
            averageScoreCalculationTime:
              executionMetrics.scoreCalculationTime / (patterns.length || 1),
          },
          results: {
            patternsFound: patterns.length,
            matchingResults: filteredResults.length,
            confidenceLevels:
              this.getConfidenceLevelDistribution(filteredResults),
          },
          conditions,
          metadata: {
            minConfidence,
            maxResults,
            includeInactive,
          },
        });
      }

      return filteredResults;
    } catch (error) {
      this.logger.error(
        `Error in pattern matching: ${error.message}`,
        error.stack,
      );
      throw new PatternMatchingException(
        'Failed to process pattern matching',
        error,
      );
    }
  }

  private validateInput(sajuPillar: ISajuPillar): void {
    if (
      !sajuPillar ||
      !sajuPillar.yearPillar ||
      !sajuPillar.monthPillar ||
      !sajuPillar.dayPillar ||
      !sajuPillar.timePillar
    ) {
      throw new PatternMatchingException('Invalid SajuPillar data structure');
    }
  }

  private createMatchingConditions(
    sajuPillar: ISajuPillar,
  ): IMatchingCondition[] {
    try {
      return [
        {
          type: 'year',
          stem: sajuPillar.yearPillar.heavenlyStem,
          branch: sajuPillar.yearPillar.earthlyBranch,
        },
        {
          type: 'month',
          stem: sajuPillar.monthPillar.heavenlyStem,
          branch: sajuPillar.monthPillar.earthlyBranch,
        },
        {
          type: 'day',
          stem: sajuPillar.dayPillar.heavenlyStem,
          branch: sajuPillar.dayPillar.earthlyBranch,
        },
        {
          type: 'time',
          stem: sajuPillar.timePillar.heavenlyStem,
          branch: sajuPillar.timePillar.earthlyBranch,
        },
      ];
    } catch (error) {
      throw new PatternMatchingException(
        'Failed to create matching conditions',
        error,
      );
    }
  }

  private async calculateMatchScore(
    pattern: InterpretationPattern,
    sajuPillar: ISajuPillar,
  ): Promise<number> {
    try {
      const score = await PatternMatchingRules.calculateOverallMatch(
        pattern,
        sajuPillar,
      );

      if (typeof score !== 'number' || isNaN(score)) {
        throw new Error('Invalid match score calculated');
      }

      return score;
    } catch (error) {
      this.logger.error(
        `Error calculating match score: ${error.message}`,
        error.stack,
      );
      throw new PatternMatchingException(
        'Failed to calculate match score',
        error,
      );
    }
  }

  private calculateConfidence(matchScore: number): number {
    return Math.min(100, Math.max(0, matchScore));
  }

  private getConfidenceLevel(confidence: number): ConfidenceLevel {
    if (confidence >= 90) {
      return ConfidenceLevel.HIGH;
    }
    if (confidence >= 70) {
      return ConfidenceLevel.MEDIUM;
    }
    if (confidence >= 50) {
      return ConfidenceLevel.LOW;
    }
    return ConfidenceLevel.VERY_LOW;
  }

  private getConfidenceLevelDistribution(
    results: IPatternMatchResult[],
  ): Record<ConfidenceLevel, number> {
    return results.reduce(
      (acc, result) => {
        acc[result.confidenceLevel] = (acc[result.confidenceLevel] || 0) + 1;
        return acc;
      },
      {} as Record<ConfidenceLevel, number>,
    );
  }

  private validateResults(results: IPatternMatchResult[]): boolean {
    try {
      if (!Array.isArray(results)) {
        this.logger.warn('Invalid results format: not an array');
        return false;
      }

      return results.every((result) => {
        const isValid =
          result &&
          typeof result.matchScore === 'number' &&
          result.matchScore >= 0 &&
          typeof result.confidence === 'number' &&
          result.confidence >= 0 &&
          result.confidence <= 100 &&
          result.pattern !== undefined &&
          result.confidenceLevel in ConfidenceLevel;

        if (!isValid) {
          this.logger.warn('Invalid result found', { result });
        }

        return isValid;
      });
    } catch (error) {
      this.logger.error('Error validating results', error);
      return false;
    }
  }
}
