// src/saju-analysis/services/interpretation-composer.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnhancedLoggingService } from '../../../common/services/enhanced-logging/enhanced-logging.service';
import { EnhancedSajuCacheService } from '../../../common/services/enhanced-saju-cache/enhanced-saju-cache.service';
import { InterpretationRules } from '../../rules/interpretation.rules';
import {
  IPatternMatchResult,
  IInterpretationResult,
  IInterpretation,
  ICompositionOptions,
  IInterpretationConflict,
  CompositionPriority,
  IApplicablePeriod,
  ICompositionContext,
} from '../../interfaces/analysis/interpretation/interpretation.interface';
import { InterpretationComposerException } from '../../exceptions/interpretation-composer.exception';
// src/saju-analysis/services/interpretation-composer.service.ts

interface ICachedInterpretation extends IInterpretation {
  timestamp: string;
}

@Injectable()
export class InterpretationComposerService {
  private readonly logger = new Logger(InterpretationComposerService.name);
  private readonly CACHE_TTL: number;
  private readonly MAX_COMBINATIONS: number;
  private readonly compositionCache = new Map<string, ICachedInterpretation>();

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
  }

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
      const { compositions, conflicts } = await this.processPatterns(
        matchResults,
        options,
        context,
      );

      return this.createFinalInterpretation(compositions, conflicts, context);
    } catch (error) {
      this.handleError(error, context);
      throw new InterpretationComposerException(
        'Failed to compose interpretation',
        error,
        context,
      );
    }
  }

  private async processPatterns(
    results: IPatternMatchResult[],
    options: ICompositionOptions,
    context: ICompositionContext,
  ): Promise<{
    compositions: IInterpretation[];
    conflicts: IInterpretationConflict[];
  }> {
    const compositions: IInterpretation[] = [];
    const conflicts: IInterpretationConflict[] = [];

    for (const result of results) {
      try {
        const { interpretation, hasConflict } =
          await InterpretationRules.composePattern(result, options);

        this.validateComposition(interpretation);

        if (hasConflict) {
          conflicts.push(this.createConflict(result, interpretation));
        } else {
          compositions.push(interpretation);
        }
      } catch (error) {
        this.logger.warn(`Pattern processing failed: ${error.message}`, {
          result,
          error,
        });
      }
    }
    return { compositions, conflicts };
  }

  private async createFinalInterpretation(
    compositions: IInterpretation[],
    conflicts: IInterpretationConflict[],
    context: ICompositionContext,
  ): Promise<IInterpretationResult> {
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
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - context.startTime,
      },
    };
  }

  private combineInterpretations(
    compositions: IInterpretation[],
  ): IInterpretation {
    return {
      id: 'combined',
      category: 'main',
      content: compositions
        .filter((comp) => comp.content)
        .map((comp) => comp.content.trim())
        .join('\n\n'),
      confidence: this.calculateTotalConfidence(compositions),
      usedPatterns: compositions.map((comp) => comp.id),
      relatedElements: this.extractRelatedElements(compositions),
      recommendations: this.extractRecommendations(compositions),
      applicablePeriod: this.determineApplicablePeriod(compositions),
      priority: CompositionPriority.PRIMARY,
      cautions: compositions
        .flatMap((comp) => comp.cautions || [])
        .filter((caution, index, self) => self.indexOf(caution) === index),
    };
  }

  private extractSupportingInterpretations(
    compositions: IInterpretation[],
  ): IInterpretation[] {
    return compositions
      .filter((comp) => comp.priority === CompositionPriority.SUPPORTING)
      .map((comp) => ({
        ...comp,
        content: comp.content.trim(),
      }));
  }

  private extractRelatedElements(compositions: IInterpretation[]): string[] {
    const elements = new Set<string>();
    compositions.forEach((comp) =>
      comp.relatedElements.forEach((element) => elements.add(element)),
    );
    return Array.from(elements);
  }

  private extractRecommendations(compositions: IInterpretation[]): string[] {
    return compositions
      .flatMap((comp) => comp.recommendations)
      .filter(
        (recommendation, index, self) => self.indexOf(recommendation) === index,
      );
  }

  private extractCautions(compositions: IInterpretation[]): string[] {
    return compositions
      .flatMap((comp) => comp.cautions || [])
      .filter((caution, index, self) => self.indexOf(caution) === index);
  }

  private createConflict(
    result: IPatternMatchResult,
    interpretation: IInterpretation,
  ): IInterpretationConflict {
    return {
      type: 'Pattern Conflict',
      description: `Conflict with pattern ${result.pattern.id}`,
      severity: 'MEDIUM',
      affectedPatterns: [result.pattern.id],
      resolution: 'Automatically resolved by combining interpretations',
    };
  }

  private determineApplicablePeriod(
    compositions: IInterpretation[],
  ): IApplicablePeriod | undefined {
    const periods = compositions
      .map((comp) => comp.applicablePeriod)
      .filter(Boolean) as IApplicablePeriod[];

    if (!periods.length) {
      return undefined;
    }

    return {
      startDate: this.findEarliestDate(periods.map((p) => p.startDate)),
      endDate: this.findLatestDate(
        periods.map((p) => p.endDate).filter(Boolean),
      ),
    };
  }

  private async getCachedComposition(
    key: string,
  ): Promise<ICachedInterpretation | undefined> {
    const cached = this.compositionCache.get(key);
    if (
      cached &&
      Date.now() - new Date(cached.timestamp).getTime() < this.CACHE_TTL * 1000
    ) {
      return cached;
    }
    return undefined;
  }

  private cacheComposition(key: string, composition: IInterpretation): void {
    const cachedComposition: ICachedInterpretation = {
      ...composition,
      timestamp: new Date().toISOString(),
    };
    this.compositionCache.set(key, cachedComposition);
  }

  private validateComposition(composition: IInterpretation): void {
    if (!composition.id || !composition.category || !composition.content) {
      throw new InterpretationComposerException(
        'Invalid composition: missing required fields',
      );
    }
    if (
      typeof composition.confidence !== 'number' ||
      composition.confidence < 0 ||
      composition.confidence > 100
    ) {
      throw new InterpretationComposerException(
        'Invalid composition: confidence must be between 0 and 100',
      );
    }
  }

  private handleError(error: Error, context: ICompositionContext): void {
    this.logger.error('Interpretation composition failed', {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      timestamp: new Date(),
      duration: Date.now() - context.startTime,
    });
  }

  private findEarliestDate(dates: string[]): string {
    if (!dates.length) {
      throw new Error('No dates provided');
    }
    dates.forEach((date) => {
      if (!this.isValidISODate(date)) {
        throw new Error(`Invalid ISO date format: ${date}`);
      }
    });
    return dates.reduce((earliest, current) =>
      earliest < current ? earliest : current,
    );
  }

  private findLatestDate(dates: string[]): string | undefined {
    return dates.length
      ? dates.reduce((latest, current) => (latest > current ? latest : current))
      : undefined;
  }

  private isValidISODate(dateStr: string): boolean {
    const regex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[-+]\d{2}:?\d{2})?$/;
    return regex.test(dateStr) && !isNaN(Date.parse(dateStr));
  }

  private calculateTotalConfidence(compositions: IInterpretation[]): number {
    if (!compositions.length) {
      return 0;
    }

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
  }
}
