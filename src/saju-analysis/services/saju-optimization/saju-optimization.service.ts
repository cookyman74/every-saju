// src/saju-analysis/services/saju-optimization.service.ts
// todo: 엔트리 검토 필요.

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnhancedLoggingService } from '../../common/services/enhanced-logging.service';
import { EnhancedSajuCacheService } from '../../common/services/enhanced-saju-cache.service';
import { SajuBatchProcessor } from '../batch/saju-batch.processor';
import { PatternMatchingService } from './pattern-matching.service';
import { InterpretationComposerService } from './interpretation-composer.service';
import { ResultFormatterService } from './result-formatter.service';
import {
  ISajuAnalysisRequest,
  ISajuOptimizedResult,
} from '../interfaces/optimization.interface';

@Injectable()
export class SajuOptimizationService {
  private readonly logger = new Logger(SajuOptimizationService.name);
  private readonly CACHE_TTL: number; // 캐시 TTL (초 단위)
  private readonly BATCH_SIZE: number; // 배치 크기
  private readonly ENABLE_CONCURRENT_PROCESSING: boolean; // 병렬 처리 활성화 여부

  constructor(
    private readonly cacheService: EnhancedSajuCacheService,
    private readonly loggingService: EnhancedLoggingService,
    private readonly configService: ConfigService,
    private readonly batchProcessor: SajuBatchProcessor,
    private readonly patternMatchingService: PatternMatchingService,
    private readonly interpretationComposerService: InterpretationComposerService,
    private readonly resultFormatterService: ResultFormatterService,
  ) {
    // 환경 변수에서 설정값 초기화
    this.CACHE_TTL = this.configService.get<number>('SAJU_CACHE_TTL', 3600);
    this.BATCH_SIZE = this.configService.get<number>('SAJU_BATCH_SIZE', 10);
    this.ENABLE_CONCURRENT_PROCESSING = this.configService.get<boolean>(
      'ENABLE_CONCURRENT_PROCESSING',
      true,
    );
  }

  /**
   * 최적화된 사주 분석을 수행
   * @param requests - 분석 요청 목록
   * @returns 최적화된 분석 결과 배열
   */
  async performOptimizedAnalysis(
    requests: ISajuAnalysisRequest[],
  ): Promise<ISajuOptimizedResult[]> {
    const startTime = Date.now();
    try {
      // 요청에 대해 캐시된 결과 검색 및 처리
      const cachedResults = await this.retrieveCachedResults(requests);

      // 캐시에 없는 요청만 새로 처리
      const uncachedRequests = requests.filter(
        (req, index) => !cachedResults[index],
      );

      // 병렬 또는 순차 처리 선택
      const newResults = this.ENABLE_CONCURRENT_PROCESSING
        ? await this.processRequestsConcurrently(uncachedRequests)
        : await this.processRequestsSequentially(uncachedRequests);

      // 결과 병합 및 캐시 저장
      const results = this.mergeResults(cachedResults, newResults);
      await this.cacheResults(uncachedRequests, newResults);

      // 성능 로그 기록
      this.logPerformanceMetrics(startTime, results.length);
      return results;
    } catch (error) {
      this.logger.error('Failed to perform optimized analysis', error.stack);
      throw error;
    }
  }

  /**
   * 캐시된 결과를 검색하여 반환
   * @param requests - 분석 요청 목록
   */
  private async retrieveCachedResults(
    requests: ISajuAnalysisRequest[],
  ): Promise<(ISajuOptimizedResult | null)[]> {
    return Promise.all(
      requests.map(async (request) => {
        const cacheKey = this.generateCacheKey(request);
        return await this.cacheService.get<ISajuOptimizedResult>(cacheKey);
      }),
    );
  }

  /**
   * 요청을 병렬로 처리
   * @param requests - 새로 처리해야 하는 요청들
   */
  private async processRequestsConcurrently(
    requests: ISajuAnalysisRequest[],
  ): Promise<ISajuOptimizedResult[]> {
    return await Promise.all(
      requests.map((request) => this.processSingleRequest(request)),
    );
  }

  /**
   * 요청을 순차적으로 처리 (병렬 처리 비활성화 시 사용)
   * @param requests - 새로 처리해야 하는 요청들
   */
  private async processRequestsSequentially(
    requests: ISajuAnalysisRequest[],
  ): Promise<ISajuOptimizedResult[]> {
    const results: ISajuOptimizedResult[] = [];
    for (const request of requests) {
      results.push(await this.processSingleRequest(request));
    }
    return results;
  }

  /**
   * 단일 요청을 처리하고 결과 반환
   * @param request - 사주 분석 요청
   */
  private async processSingleRequest(
    request: ISajuAnalysisRequest,
  ): Promise<ISajuOptimizedResult> {
    try {
      const matchResults =
        await this.patternMatchingService.findMatchingPatterns(
          request.sajuPillar,
        );
      const interpretation =
        await this.interpretationComposerService.composeInterpretation(
          matchResults,
        );
      return await this.resultFormatterService.formatResult(interpretation);
    } catch (error) {
      this.logger.error(
        `Failed to process request: ${request.id}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * 새로운 결과를 캐시에 저장
   * @param requests - 처리된 요청 목록
   * @param results - 새로 생성된 결과 목록
   */
  private async cacheResults(
    requests: ISajuAnalysisRequest[],
    results: ISajuOptimizedResult[],
  ): Promise<void> {
    await Promise.all(
      requests.map((request, index) => {
        const cacheKey = this.generateCacheKey(request);
        return this.cacheService.set(cacheKey, results[index], this.CACHE_TTL);
      }),
    );
  }

  /**
   * 요청 ID 기반으로 캐시 키 생성
   * @param request - 사주 분석 요청
   */
  private generateCacheKey(request: ISajuAnalysisRequest): string {
    return `saju_analysis:${request.id}`;
  }

  /**
   * 캐시된 결과와 새로 계산된 결과를 병합
   * @param cachedResults - 캐시된 결과 목록
   * @param newResults - 새로 생성된 결과 목록
   */
  private mergeResults(
    cachedResults: (ISajuOptimizedResult | null)[],
    newResults: ISajuOptimizedResult[],
  ): ISajuOptimizedResult[] {
    return cachedResults.map(
      (cachedResult, index) => cachedResult || newResults[index],
    );
  }

  /**
   * 성능 메트릭 로깅 - 처리 시간과 처리한 결과 개수를 기록
   */
  private logPerformanceMetrics(startTime: number, resultCount: number): void {
    const duration = Date.now() - startTime;
    this.loggingService.logAnalysis('SAJU_OPTIMIZATION', {
      level: 'DEBUG',
      duration,
      resultCount,
      timestamp: new Date(),
    });
  }
}
