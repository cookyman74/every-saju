// src/saju-analysis/services/saju-analysis.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnhancedLoggingService } from '../../common/services/enhanced-logging/enhanced-logging.service';
import { EnhancedSajuCacheService } from '../../common/services/enhanced-saju-cache/enhanced-saju-cache.service';
import { PatternMatchingService } from './pattern-matching/pattern-matching.service';
import { InterpretationComposerService } from './interpretation-composer/interpretation-composer.service';
import { ResultFormatterService } from './result-formatter/result-formatter.service';
import { SajuOptimizationService } from './saju-optimization/saju-optimization.service';
import {
  ISajuAnalysisRequest,
  ISajuAnalysisResult,
} from '../interfaces/saju-analysis.interface';
import { SajuAnalysisException } from '../exceptions/saju-analysis.exception';

@Injectable()
export class SajuAnalysisService {
  private readonly logger = new Logger(SajuAnalysisService.name);
  private readonly CACHE_TTL: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: EnhancedSajuCacheService,
    private readonly loggingService: EnhancedLoggingService,
    private readonly patternMatchingService: PatternMatchingService,
    private readonly interpretationComposerService: InterpretationComposerService,
    private readonly resultFormatterService: ResultFormatterService,
    private readonly sajuOptimizationService: SajuOptimizationService,
  ) {
    // 환경 변수에서 캐시 TTL 설정
    this.CACHE_TTL = this.configService.get<number>(
      'SAJU_ANALYSIS_CACHE_TTL',
      3600,
    );
  }

  /**
   * 사주 분석 요청에 대한 전체 분석 워크플로우를 수행
   * @param request - 분석 요청 데이터
   * @returns 분석 결과
   */
  async analyzeSaju(
    request: ISajuAnalysisRequest,
  ): Promise<ISajuAnalysisResult> {
    const context = {
      method: 'analyzeSaju',
      requestId: request.id,
      timestamp: new Date(),
    };

    try {
      const startTime = Date.now();

      // 캐시에서 기존 결과 조회
      const cachedResult = await this.retrieveCachedResult(request);
      if (cachedResult) {
        this.logCacheHit(cachedResult, context);
        return cachedResult;
      }

      // 1. 패턴 매칭 서비스 호출
      const matchResults =
        await this.patternMatchingService.findMatchingPatterns(
          request.sajuPillar,
        );
      if (!matchResults.length) {
        throw new SajuAnalysisException('No matching patterns found', context);
      }

      // 2. 해석 조합 서비스 호출
      const interpretation =
        await this.interpretationComposerService.composeInterpretation(
          matchResults,
        );

      // 3. 결과 포맷팅 서비스 호출
      const formattedResult =
        await this.resultFormatterService.formatResult(interpretation);

      // 4. 최적화 서비스 적용
      const optimizedResult =
        await this.sajuOptimizationService.performOptimizedAnalysis([request]);
      const finalResult = optimizedResult[0] || formattedResult;

      // 캐시에 결과 저장
      await this.cacheResult(request, finalResult);

      // 성능 로그 기록
      this.logPerformanceMetrics(startTime, finalResult, context);

      return finalResult;
    } catch (error) {
      this.handleError(error, context);
      throw new SajuAnalysisException('Failed to analyze Saju', error, context);
    }
  }

  /**
   * 캐시된 결과를 검색하여 반환
   * @param request - 분석 요청 데이터
   */
  private async retrieveCachedResult(
    request: ISajuAnalysisRequest,
  ): Promise<ISajuAnalysisResult | null> {
    const cacheKey = this.generateCacheKey(request);
    return await this.cacheService.get<ISajuAnalysisResult>(cacheKey);
  }

  /**
   * 새로 생성된 분석 결과를 캐시에 저장
   * @param request - 분석 요청 데이터
   * @param result - 분석 결과
   */
  private async cacheResult(
    request: ISajuAnalysisRequest,
    result: ISajuAnalysisResult,
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(request);
    await this.cacheService.set(cacheKey, result, this.CACHE_TTL);
  }

  /**
   * 캐시 키 생성 - 요청 ID 기반으로 캐시 키 생성
   * @param request - 분석 요청 데이터
   */
  private generateCacheKey(request: ISajuAnalysisRequest): string {
    return `saju_analysis:${request.id}`;
  }

  /**
   * 캐시 히트 로깅
   * @param result - 캐시된 분석 결과
   * @param context - 로깅을 위한 컨텍스트
   */
  private logCacheHit(result: ISajuAnalysisResult, context: any): void {
    this.loggingService.logAnalysis('SAJU_CACHE_HIT', {
      level: 'DEBUG',
      context,
      resultConfidence: result.confidence,
      timestamp: new Date(),
    });
  }

  /**
   * 성능 메트릭 로깅 - 전체 처리 시간과 결과 데이터를 기록
   * @param startTime - 처리 시작 시간
   * @param result - 최종 분석 결과
   * @param context - 로깅을 위한 컨텍스트
   */
  private logPerformanceMetrics(
    startTime: number,
    result: ISajuAnalysisResult,
    context: any,
  ): void {
    const duration = Date.now() - startTime;
    this.loggingService.logAnalysis('SAJU_ANALYSIS', {
      level: 'DEBUG',
      duration,
      resultConfidence: result.confidence,
      context,
      timestamp: new Date(),
    });
  }

  /**
   * 에러 처리 - 에러를 로깅하고 상세 정보를 포함하여 예외를 던짐
   * @param error - 발생한 에러
   * @param context - 로깅을 위한 컨텍스트
   */
  private handleError(error: Error, context: any): void {
    this.logger.error('Saju analysis failed', {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      },
    });
  }
}
