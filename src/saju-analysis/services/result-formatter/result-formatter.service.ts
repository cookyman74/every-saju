// src/saju-analysis/services/result-formatter.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnhancedLoggingService } from '../../common/services/enhanced-logging.service';
import {
  IInterpretationResult,
  IFormattedResult,
  IFormattingOptions,
  IFormattingContext,
  FormattingType,
  OutputFormat,
} from '../interfaces/result-formatter.interface';
import { ResultFormatterException } from '../exceptions/result-formatter.exception';

@Injectable()
export class ResultFormatterService {
  private readonly logger = new Logger(ResultFormatterService.name);
  private readonly DEFAULT_LANGUAGE: string;
  private readonly MAX_SUMMARY_LENGTH: number;
  private readonly INCLUDE_METADATA: boolean;

  constructor(
    private readonly loggingService: EnhancedLoggingService,
    private readonly configService: ConfigService,
  ) {
    this.DEFAULT_LANGUAGE = this.configService.get<string>(
      'DEFAULT_LANGUAGE',
      'ko',
    );
    this.MAX_SUMMARY_LENGTH = this.configService.get<number>(
      'MAX_SUMMARY_LENGTH',
      300,
    );
    this.INCLUDE_METADATA = this.configService.get<boolean>(
      'INCLUDE_RESULT_METADATA',
      true,
    );
  }

  /**
   * 해석 결과를 지정된 형식으로 포맷팅
   * @param result - 포맷팅할 해석 결과
   * @param options - 포맷팅 옵션
   */
  async formatResult(
    result: IInterpretationResult,
    options: IFormattingOptions = {},
  ): Promise<IFormattedResult> {
    const context: IFormattingContext = {
      method: 'formatResult',
      startTime: Date.now(),
      resultId: result.metadata?.id,
      options,
    };

    try {
      // 입력값 검증
      this.validateInput(result);

      // 기본 옵션 설정
      const formattingOptions = this.prepareFormattingOptions(options);

      // 메인 해석 포맷팅
      const mainInterpretation = await this.formatMainInterpretation(
        result.mainInterpretation,
        formattingOptions,
      );

      // 보조 해석 포맷팅
      const supportingInterpretations =
        await this.formatSupportingInterpretations(
          result.supportingInterpretations,
          formattingOptions,
        );

      // 충돌 정보 포맷팅
      const conflicts = await this.formatConflicts(
        result.conflicts,
        formattingOptions,
      );

      // 최종 결과 생성
      const formattedResult = {
        type: formattingOptions.type,
        format: formattingOptions.outputFormat,
        content: {
          main: mainInterpretation,
          supporting: supportingInterpretations,
          conflicts: conflicts,
          summary: await this.createSummary(
            mainInterpretation,
            formattingOptions,
          ),
        },
        confidence: result.confidence,
        metadata: this.INCLUDE_METADATA
          ? this.formatMetadata(result.metadata)
          : undefined,
      };

      // 성능 메트릭 로깅
      this.logFormattingMetrics(
        result,
        formattedResult,
        Date.now() - context.startTime,
        context,
      );

      return formattedResult;
    } catch (error) {
      this.handleError(error, context);
      throw new ResultFormatterException(
        'Failed to format interpretation result',
        error,
        context,
      );
    }
  }

  /**
   * 입력값 검증
   * @param result - 검증할 해석 결과
   */
  private validateInput(result: IInterpretationResult): void {
    if (!result) {
      throw new ResultFormatterException('Result cannot be null or undefined');
    }

    const requiredFields = ['mainInterpretation', 'confidence', 'metadata'];
    requiredFields.forEach((field) => {
      if (!(field in result)) {
        throw new ResultFormatterException(`Missing required field: ${field}`);
      }
    });

    if (
      typeof result.confidence !== 'number' ||
      result.confidence < 0 ||
      result.confidence > 100
    ) {
      throw new ResultFormatterException('Invalid confidence value');
    }
  }

  /**
   * 포맷팅 옵션 준비
   * @param options - 사용자 지정 옵션
   */
  private prepareFormattingOptions(
    options: IFormattingOptions,
  ): Required<IFormattingOptions> {
    return {
      type: options.type || FormattingType.DETAILED,
      language: options.language || this.DEFAULT_LANGUAGE,
      outputFormat: options.outputFormat || OutputFormat.TEXT,
      includeMetadata: options.includeMetadata ?? this.INCLUDE_METADATA,
      maxSummaryLength: options.maxSummaryLength || this.MAX_SUMMARY_LENGTH,
      formatVersion: options.formatVersion || '1.0',
    };
  }

  /**
   * 메인 해석 포맷팅
   * @param interpretation - 포맷팅할 메인 해석
   * @param options - 포맷팅 옵션
   */
  private async formatMainInterpretation(
    interpretation: string,
    options: Required<IFormattingOptions>,
  ): Promise<string> {
    try {
      let formatted = interpretation;

      // 언어별 포맷팅 규칙 적용
      formatted = this.applyLanguageFormatting(formatted, options.language);

      // 출력 형식에 따른 변환
      switch (options.outputFormat) {
        case OutputFormat.HTML:
          formatted = this.convertToHtml(formatted);
          break;
        case OutputFormat.MARKDOWN:
          formatted = this.convertToMarkdown(formatted);
          break;
        case OutputFormat.TEXT:
        default:
          formatted = this.formatPlainText(formatted);
      }

      return formatted;
    } catch (error) {
      throw new ResultFormatterException(
        'Failed to format main interpretation',
        error,
      );
    }
  }

  /**
   * 보조 해석 포맷팅
   * @param interpretations - 포맷팅할 보조 해석들
   * @param options - 포맷팅 옵션
   */
  private async formatSupportingInterpretations(
    interpretations: string[],
    options: Required<IFormattingOptions>,
  ): Promise<string[]> {
    try {
      return await Promise.all(
        interpretations.map(async (interpretation) => {
          const formatted = await this.formatMainInterpretation(
            interpretation,
            options,
          );
          return this.addSupportingContext(formatted);
        }),
      );
    } catch (error) {
      throw new ResultFormatterException(
        'Failed to format supporting interpretations',
        error,
      );
    }
  }

  /**
   * 충돌 정보 포맷팅
   * @param conflicts - 포맷팅할 충돌 정보
   * @param options - 포맷팅 옵션
   */
  private async formatConflicts(
    conflicts: any[],
    options: Required<IFormattingOptions>,
  ): Promise<any[]> {
    try {
      return conflicts.map((conflict) => ({
        type: conflict.type,
        description: this.formatDescription(conflict.description, options),
        resolution: this.formatDescription(conflict.resolution, options),
        severity: conflict.severity,
      }));
    } catch (error) {
      throw new ResultFormatterException('Failed to format conflicts', error);
    }
  }

  /**
   * 요약본 생성
   * @param mainInterpretation - 메인 해석 내용
   * @param options - 포맷팅 옵션
   */
  private async createSummary(
    mainInterpretation: string,
    options: Required<IFormattingOptions>,
  ): Promise<string> {
    try {
      // 주요 문장 추출
      const sentences = this.extractSentences(mainInterpretation);

      // 중요도에 따라 문장 정렬
      const rankedSentences = this.rankSentences(sentences);

      // 최대 길이를 고려하여 요약본 생성
      let summary = this.combineSentences(
        rankedSentences,
        options.maxSummaryLength,
      );

      // 출력 형식에 맞게 포맷팅
      summary = this.applyLanguageFormatting(summary, options.language);

      return summary;
    } catch (error) {
      throw new ResultFormatterException('Failed to create summary', error);
    }
  }

  /**
   * 메타데이터 포맷팅
   * @param metadata - 포맷팅할 메타데이터
   */
  private formatMetadata(metadata: any): any {
    try {
      return {
        ...metadata,
        formattedTimestamp: new Date(metadata.timestamp).toISOString(),
        processingDuration: `${metadata.processingTime}ms`,
      };
    } catch (error) {
      this.logger.warn('Failed to format metadata', { error, metadata });
      return metadata; // 실패 시 원본 반환
    }
  }

  /**
   * 텍스트 형식 변환 유틸리티
   */
  private convertToHtml(text: string): string {
    return text
      .split('\n\n')
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join('\n');
  }

  private convertToMarkdown(text: string): string {
    return text
      .split('\n\n')
      .map((paragraph) => `${paragraph}\n\n`)
      .join('');
  }

  private formatPlainText(text: string): string {
    return text.trim();
  }

  /**
   * 언어별 포맷팅 규칙 적용
   * @param text - 포맷팅할 텍스트
   * @param language - 언어 코드
   */
  private applyLanguageFormatting(text: string, language: string): string {
    try {
      switch (language.toLowerCase()) {
        case 'ko':
          return this.formatKoreanText(text);
        case 'en':
          return this.formatEnglishText(text);
        default:
          return text;
      }
    } catch (error) {
      this.logger.warn('Language formatting failed', { error, language });
      return text; // 실패 시 원본 반환
    }
  }

  /**
   * 성능 메트릭 로깅
   */
  private logFormattingMetrics(
    originalResult: IInterpretationResult,
    formattedResult: IFormattedResult,
    duration: number,
    context: IFormattingContext,
  ): void {
    this.loggingService.logAnalysis('RESULT_FORMATTING', {
      level: 'DEBUG',
      context: {
        ...context,
        duration,
      },
      metrics: {
        originalLength: originalResult.mainInterpretation.length,
        formattedLength: formattedResult.content.main.length,
        compressionRatio:
          formattedResult.content.main.length /
          originalResult.mainInterpretation.length,
        supportingCount: formattedResult.content.supporting.length,
        duration,
      },
      metadata: {
        type: formattedResult.type,
        format: formattedResult.format,
        confidence: formattedResult.confidence,
      },
    });
  }

  /**
   * 에러 처리
   */
  private handleError(error: Error, context: IFormattingContext): void {
    this.logger.error('Result formatting failed', {
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

  /**
   * 문장 추출 및 순위화 유틸리티
   */
  private extractSentences(text: string): string[] {
    return text
      .split(/[.!?。]+/g)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  private rankSentences(sentences: string[]): string[] {
    return sentences.sort((a, b) => {
      // 문장의 중요도를 계산하는 로직
      const scoreA = this.calculateSentenceImportance(a);
      const scoreB = this.calculateSentenceImportance(b);
      return scoreB - scoreA;
    });
  }

  private calculateSentenceImportance(sentence: string): number {
    // 문장의 중요도를 계산하는 로직
    // 예: 키워드 출현 빈도, 문장 길이, 위치 등을 고려
    let score = 0;
    score += sentence.length * 0.1;
    score += (sentence.match(/[중요|핵심|특징|결론]/g) || []).length * 2;
    return score;
  }

  private combineSentences(sentences: string[], maxLength: number): string {
    let result = '';
    for (const sentence of sentences) {
      const potentialResult = result + sentence + '. ';
      if (potentialResult.length > maxLength) {
        break;
      }
      result = potentialResult;
    }
    return result.trim();
  }

  private addSupportingContext(text: string): string {
    return `참고사항: ${text}`;
  }
}
