// src/saju-analysis/services/interpretation-composer.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnhancedLoggingService } from '../../../common/services/enhanced-logging/enhanced-logging.service';
import { EnhancedSajuCacheService } from '../../../common/services/enhanced-saju-cache/enhanced-saju-cache.service';
import { InterpretationRules } from '../../rules/interpretation.rules';
import {
  IPatternMatchResult,
  IInterpretationResult,
  ICompositionOptions,
  CompositionPriority,
  ICompositionMetrics,
  ICompositionContext,
} from '../../interfaces/analysis/interpretation/interpretation.interface';
import { InterpretationComposerException } from '../exceptions/interpretation-composer.exception';
import { createHash } from 'crypto';

@Injectable()
export class InterpretationComposerService {
  private readonly logger = new Logger(InterpretationComposerService.name);
  private readonly CACHE_TTL: number;
  private readonly MAX_COMBINATIONS: number;
  private readonly CACHE_ENABLED: boolean;

  constructor(
    private readonly loggingService: EnhancedLoggingService,
    private readonly cacheService: EnhancedSajuCacheService,
    private readonly configService: ConfigService,
  ) {
    this.CACHE_TTL = this.configService.get<number>(
      'INTERPRETATION_CACHE_TTL',
      3600,
    );
    this.MAX_COMBINATIONS = this.configService.get<number>(
      'MAX_INTERPRETATION_COMBINATIONS',
      100,
    );
    this.CACHE_ENABLED = this.configService.get<boolean>(
      'INTERPRETATION_CACHE_ENABLED',
      true,
    );
  }

  /**
   * 매칭된 패턴들을 조합하여 최종 해석 결과를 생성
   * @param matchResults - 매칭된 패턴 결과들
   * @param options - 해석 조합 옵션
   * @returns 최종 해석 결과
   */
  async composeInterpretation(
    matchResults: IPatternMatchResult[],
    options: ICompositionOptions = {},
  ): Promise<IInterpretationResult> {
    const context: ICompositionContext = {
      method: 'composeInterpretation',
      matchResultsCount: matchResults.length,
      options,
      startTime: Date.now(),
    };

    try {
      const metrics: ICompositionMetrics = {
        processingTime: 0,
        combinationsCount: 0,
        conflictResolutions: 0,
        cacheHit: false,
      };

      // 입력값 검증
      this.validateInput(matchResults);

      // 캐시 확인
      if (this.CACHE_ENABLED) {
        const cacheKey = await this.generateCacheKey(matchResults);
        const cachedResult =
          await this.cacheService.get<IInterpretationResult>(cacheKey);

        if (cachedResult) {
          metrics.cacheHit = true;
          this.logCacheHit(cacheKey, cachedResult, context);
          return cachedResult;
        }

        // 캐시 결과 저장을 위한 컨텍스트 업데이트
        context.cacheKey = cacheKey;
      }

      // 결과 우선순위 설정
      const prioritizedResults = await this.prioritizeResults(matchResults);
      metrics.combinationsCount = prioritizedResults.length;

      // 패턴 조합 및 충돌 해결
      const { compositions, conflicts } = await this.processPatterns(
        prioritizedResults,
        options,
        context,
      );
      metrics.conflictResolutions = conflicts.length;

      // 최종 해석 생성
      const interpretation = await this.createFinalInterpretation(
        compositions,
        conflicts,
        context,
      );

      // 메트릭 완성
      metrics.processingTime = Date.now() - context.startTime;

      // 결과 캐싱
      if (this.CACHE_ENABLED && context.cacheKey) {
        await this.cacheService.set(
          context.cacheKey,
          interpretation,
          this.CACHE_TTL,
        );
      }

      // 결과 로깅
      this.logCompositionMetrics(metrics, interpretation, context);

      return interpretation;
    } catch (error) {
      this.handleError(error, context);
      throw new InterpretationComposerException(
        'Failed to compose interpretation',
        error,
        context,
      );
    }
  }

  /**
   * 입력값 검증
   * @param matchResults - 검증할 매칭 결과들
   */
  private validateInput(matchResults: IPatternMatchResult[]): void {
    if (!Array.isArray(matchResults)) {
      throw new InterpretationComposerException(
        'Invalid input: matchResults must be an array',
      );
    }

    if (matchResults.length === 0) {
      throw new InterpretationComposerException(
        'Invalid input: matchResults array is empty',
      );
    }

    matchResults.forEach((result, index) => {
      if (!result || !result.pattern || typeof result.confidence !== 'number') {
        throw new InterpretationComposerException(
          `Invalid match result at index ${index}`,
        );
      }
    });
  }

  /**
   * 결과 우선순위 설정
   * @param results - 우선순위를 설정할 결과들
   */
  private async prioritizeResults(
    results: IPatternMatchResult[],
  ): Promise<IPatternMatchResult[]> {
    try {
      return results
        .sort((a, b) => {
          // 신뢰도 기반 1차 정렬
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          // 패턴 가중치 기반 2차 정렬
          if (b.pattern.weight !== a.pattern.weight) {
            return b.pattern.weight - a.pattern.weight;
          }
          // 패턴 ID 기반 3차 정렬 (안정적 정렬을 위해)
          return a.pattern.id.localeCompare(b.pattern.id);
        })
        .slice(0, this.MAX_COMBINATIONS);
    } catch (error) {
      throw new InterpretationComposerException(
        'Failed to prioritize results',
        error,
      );
    }
  }

  /**
   * 패턴 처리 (조합 및 충돌 해결)
   * @param results - 처리할 결과들
   * @param options - 조합 옵션
   * @param context - 실행 컨텍스트
   */
  private async processPatterns(
    results: IPatternMatchResult[],
    options: ICompositionOptions,
    context: ICompositionContext,
  ): Promise<{
    compositions: Array<any>;
    conflicts: Array<any>;
  }> {
    const compositions: Array<any> = [];
    const conflicts: Array<any> = [];
    const processingContext = {
      ...context,
      method: 'processPatterns',
      totalPatterns: results.length,
    };

    try {
      for (const result of results) {
        try {
          const { composition, hasConflict } = await this.processPattern(
            result,
            compositions,
            options,
          );

          if (hasConflict) {
            conflicts.push(composition);
          } else {
            compositions.push(composition);
          }
        } catch (error) {
          // 개별 패턴 처리 실패는 전체 프로세스를 중단하지 않음
          this.logger.warn(`Failed to process pattern: ${error.message}`, {
            ...processingContext,
            pattern: result.pattern.id,
            error,
          });
        }
      }

      return { compositions, conflicts };
    } catch (error) {
      throw new InterpretationComposerException(
        'Failed to process patterns',
        error,
        processingContext,
      );
    }
  }

  /**
   * 단일 패턴 처리
   * @param result - 처리할 패턴 결과
   * @param existingCompositions - 기존 조합 결과들
   * @param options - 조합 옵션
   */
  private async processPattern(
    result: IPatternMatchResult,
    existingCompositions: Array<any>,
    options: ICompositionOptions,
  ): Promise<{
    composition: any;
    hasConflict: boolean;
  }> {
    try {
      const composition = await InterpretationRules.composePattern(
        result,
        existingCompositions,
        options,
      );

      const hasConflict = this.checkConflicts(
        composition,
        existingCompositions,
      );

      return { composition, hasConflict };
    } catch (error) {
      throw new Error(`Pattern processing failed: ${error.message}`);
    }
  }

  /**
   * 충돌 확인
   * @param composition - 확인할 조합
   * @param existingCompositions - 기존 조합들
   */
  private checkConflicts(
    composition: any,
    existingCompositions: Array<any>,
  ): boolean {
    return InterpretationRules.hasConflicts(composition, existingCompositions);
  }

  /**
   * 최종 해석 생성
   * @param compositions - 조합된 해석들
   * @param conflicts - 발견된 충돌들
   * @param context - 실행 컨텍스트
   */
  private async createFinalInterpretation(
    compositions: Array<any>,
    conflicts: Array<any>,
    context: ICompositionContext,
  ): Promise<IInterpretationResult> {
    const processingContext = {
      ...context,
      method: 'createFinalInterpretation',
      compositionsCount: compositions.length,
      conflictsCount: conflicts.length,
    };

    try {
      const resolvedConflicts =
        await InterpretationRules.resolveConflicts(conflicts);

      return {
        mainInterpretation: this.combineInterpretations(compositions),
        supportingInterpretations:
          this.extractSupportingInterpretations(compositions),
        conflicts: resolvedConflicts,
        confidence: this.calculateTotalConfidence(compositions),
        metadata: {
          compositionCount: compositions.length,
          conflictCount: conflicts.length,
          timestamp: new Date(),
          processingTime: Date.now() - context.startTime,
        },
      };
    } catch (error) {
      throw new InterpretationComposerException(
        'Failed to create final interpretation',
        error,
        processingContext,
      );
    }
  }

  /**
   * 해석 조합
   * @param compositions - 조합할 해석들
   */
  private combineInterpretations(compositions: Array<any>): string {
    try {
      return compositions
        .filter((comp) => comp && comp.content) // 유효한 컨텐츠만 필터링
        .map((comp) => comp.content.trim()) // 여백 제거
        .filter((content) => content.length > 0) // 빈 문자열 제거
        .join('\n\n');
    } catch (error) {
      throw new Error(`Failed to combine interpretations: ${error.message}`);
    }
  }

  /**
   * 보조 해석 추출
   * @param compositions - 추출할 해석들
   */
  private extractSupportingInterpretations(compositions: Array<any>): string[] {
    try {
      return compositions
        .filter(
          (comp) =>
            comp &&
            comp.priority === CompositionPriority.SUPPORTING &&
            comp.content,
        )
        .map((comp) => comp.content.trim())
        .filter((content) => content.length > 0);
    } catch (error) {
      throw new Error(
        `Failed to extract supporting interpretations: ${error.message}`,
      );
    }
  }

  /**
   * 전체 신뢰도 계산
   * @param compositions - 계산할 해석들
   */
  private calculateTotalConfidence(compositions: Array<any>): number {
    if (!compositions.length) {
      return 0;
    }

    try {
      const validCompositions = compositions.filter(
        (comp) => comp && typeof comp.confidence === 'number',
      );

      if (!validCompositions.length) {
        return 0;
      }

      const totalConfidence = validCompositions.reduce(
        (sum, comp) => sum + comp.confidence,
        0,
      );

      return Math.round(totalConfidence / validCompositions.length);
    } catch (error) {
      throw new Error(`Failed to calculate total confidence: ${error.message}`);
    }
  }

  /**
   * 캐시 키 생성
   * @param results - 캐시 키 생성에 사용할 결과들
   */
  private async generateCacheKey(
    results: IPatternMatchResult[],
  ): Promise<string> {
    try {
      // 핵심 정보만 추출하여 해시 생성
      const keyData = results.map((r) => ({
        id: r.pattern.id,
        confidence: Math.round(r.confidence), // 소수점 제거
        weight: r.pattern.weight,
      }));

      // 정렬하여 순서 독립성 보장
      keyData.sort((a, b) => a.id.localeCompare(b.id));

      // SHA-256 해시 생성
      const hash = createHash('sha256')
        .update(JSON.stringify(keyData))
        .digest('hex');

      return `interpretation:${hash}`;
    } catch (error) {
      throw new Error(`Failed to generate cache key: ${error.message}`);
    }
  }

  /**
   * 캐시 히트 로깅
   * @param cacheKey - 캐시 키
   * @param result - 캐시된 결과
   * @param context - 실행 컨텍스트
   */
  private logCacheHit(
    cacheKey: string,
    result: IInterpretationResult,
    context: ICompositionContext,
  ): void {
    this.loggingService.logAnalysis('INTERPRETATION_CACHE_HIT', {
      level: 'DEBUG',
      cacheKey,
      context,
      result: {
        confidence: result.confidence,
        compositionCount: result.metadata.compositionCount,
        conflictCount: result.metadata.conflictCount,
        timestamp: result.metadata.timestamp,
      },
    });
  }

  /**
   * 성능 메트릭 로깅
   * @param metrics - 로깅할 메트릭
   * @param interpretation - 해석 결과
   * @param context - 실행 컨텍스트
   */
  private logCompositionMetrics(
    metrics: ICompositionMetrics,
    interpretation: IInterpretationResult,
    context: ICompositionContext,
  ): void {
    this.loggingService.logAnalysis('INTERPRETATION_COMPOSITION', {
      level: 'DEBUG',
      context,
      metrics: {
        ...metrics,
        averageProcessingTimePerPattern:
          metrics.combinationsCount > 0
            ? metrics.processingTime / metrics.combinationsCount
            : 0,
      },
      results: {
        confidence: interpretation.confidence,
        compositionLength: interpretation.mainInterpretation.length,
        supportingCount: interpretation.supportingInterpretations.length,
        conflictCount: interpretation.conflicts.length,
        metadata: interpretation.metadata,
      },
    });
  }

  /**
   * 에러 처리
   * @param error - 발생한 에러
   * @param context - 실행 컨텍스트
   */
  private handleError(error: Error, context: ICompositionContext): void {
    this.logger.error('Interpretation composition failed', {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      },
      timestamp: new Date(),
      duration: Date.now() - context.startTime,
    });
  }
}
