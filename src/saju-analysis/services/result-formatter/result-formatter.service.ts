// src/saju-analysis/services/result-formatter.service.ts
// todo: 앤트리 확인 필요.

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
  private readonly DEFAULT_LANGUAGE: string; // 기본 언어 설정
  private readonly MAX_SUMMARY_LENGTH: number; // 요약의 최대 길이
  private readonly INCLUDE_METADATA: boolean; // 메타데이터 포함 여부

  constructor(
    private readonly loggingService: EnhancedLoggingService,
    private readonly configService: ConfigService,
  ) {
    // 환경 변수를 통해 기본 설정값 가져오기
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
   * 해석 결과를 지정된 형식으로 포맷팅하는 메인 메서드
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
      this.validateInput(result); // 입력값 검증
      const formattingOptions = this.prepareFormattingOptions(options); // 옵션 설정

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
   * 입력값 검증 메서드 - 필수 필드들이 제대로 포함되었는지 확인
   */
  private validateInput(result: IInterpretationResult): void {
    if (!result) {
      throw new ResultFormatterException('Result cannot be null or undefined');
    }

    // 필수 필드가 있는지 확인
    const requiredFields = ['mainInterpretation', 'confidence', 'metadata'];
    requiredFields.forEach((field) => {
      if (!(field in result)) {
        throw new ResultFormatterException(`Missing required field: ${field}`);
      }
    });

    // 신뢰도 값이 유효한지 확인
    if (
      typeof result.confidence !== 'number' ||
      result.confidence < 0 ||
      result.confidence > 100
    ) {
      throw new ResultFormatterException('Invalid confidence value');
    }
  }

  /**
   * 포맷팅 옵션을 설정 - 기본 옵션과 사용자 옵션을 조합
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
   * 메인 해석 포맷팅 - 지정된 옵션에 따라 메인 해석을 포맷팅
   */
  private async formatMainInterpretation(
    interpretation: string,
    options: Required<IFormattingOptions>,
  ): Promise<string> {
    try {
      let formatted = this.applyLanguageFormatting(
        interpretation,
        options.language,
      );
      switch (options.outputFormat) {
        case OutputFormat.HTML:
          formatted = this.convertToHtml(formatted);
          break;
        case OutputFormat.MARKDOWN:
          formatted = this.convertToMarkdown(formatted);
          break;
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
   * 보조 해석 포맷팅 - 보조 해석들을 각각 포맷팅하여 반환
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
   * 충돌 정보 포맷팅 - 각 충돌 정보를 포맷팅
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
   * 요약 생성 - 결과를 짧게 요약하여 반환
   */
  private async createSummary(
    content: string,
    options: Required<IFormattingOptions>,
  ): Promise<string> {
    const summary = content.slice(0, options.maxSummaryLength);
    return options.outputFormat === OutputFormat.HTML
      ? `<p>${summary}</p>`
      : summary;
  }

  /**
   * 메타데이터 포맷팅 - 결과 메타데이터를 포맷
   */
  private formatMetadata(metadata: any): any {
    return {
      ...metadata,
      timestamp: new Date(),
    };
  }

  /**
   * 성능 메트릭 로깅 - 포맷팅 과정에서 수집된 성능 메트릭을 로깅
   */
  private logFormattingMetrics(
    originalResult: IInterpretationResult,
    formattedResult: IFormattedResult,
    duration: number,
    context: IFormattingContext,
  ): void {
    this.loggingService.logAnalysis('RESULT_FORMATTING', {
      level: 'DEBUG',
      duration,
      context,
      formattedResultLength: formattedResult.content.main.length,
      confidence: originalResult.confidence,
      timestamp: new Date(),
    });
  }

  /**
   * 에러 처리 - 포맷팅 중 발생한 에러를 로깅하고 처리
   */
  private handleError(error: Error, context: IFormattingContext): void {
    this.logger.error('Formatting failed', {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  /**
   * 언어별 포맷팅 적용 - 언어에 따라 텍스트를 다르게 포맷
   */
  private applyLanguageFormatting(text: string, language: string): string {
    return text; // 실제 구현 시 언어에 따른 포맷 적용
  }

  /**
   * 텍스트를 HTML 형식으로 변환
   */
  private convertToHtml(text: string): string {
    return `<p>${text}</p>`;
  }

  /**
   * 텍스트를 마크다운 형식으로 변환
   */
  private convertToMarkdown(text: string): string {
    return `**${text}**`;
  }

  /**
   * 기본 텍스트 포맷 - 추가 변환 없이 일반 텍스트로 반환
   */
  private formatPlainText(text: string): string {
    return text;
  }

  /**
   * 보조 해석 문맥 추가 - 보조 해석의 경우 추가 문맥을 포함해 반환
   */
  private addSupportingContext(formatted: string): string {
    return `Supporting: ${formatted}`;
  }

  /**
   * 설명 포맷팅 - 충돌 설명 또는 해결 정보를 지정된 형식으로 변환
   */
  private formatDescription(
    text: string,
    options: Required<IFormattingOptions>,
  ): string {
    return options.outputFormat === OutputFormat.MARKDOWN
      ? `**${text}**`
      : text;
  }
}
