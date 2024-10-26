import { Injectable } from '@nestjs/common';
import { InterpretationRepository } from '../repositories/interpretation.repository/interpretation.repository';
import { EnhancedSajuCacheService } from '../../common/services/enhanced-saju-cache/enhanced-saju-cache.service';
import { EnhancedLoggingService } from '../../common/services/enhanced-logging/enhanced-logging.service';
import { PatternMatchingService } from './pattern-matching/pattern-matching.service';
import { InterpretationComposerService } from './interpretation-composer/interpretation-composer.service';
import { ResultFormatterService } from './result-formatter/result-formatter.service';

@Injectable()
export class SajuAnalysisService {
  constructor(
    private readonly interpretationRepo: InterpretationRepository,
    private readonly cacheService: EnhancedSajuCacheService,
    private readonly loggingService: EnhancedLoggingService,
    private readonly patternMatchingService: PatternMatchingService,
    private readonly interpretationComposerService: InterpretationComposerService,
    private readonly resultFormatterService: ResultFormatterService,
  ) {}

  async analyzeSaju(birthInfo: any) {
    try {
      // 1. 패턴 매칭
      const matchedPatterns =
        await this.patternMatchingService.findMatches(birthInfo);

      // 2. 해석 조합
      const interpretations =
        await this.interpretationComposerService.compose(matchedPatterns);

      // 3. 결과 포맷팅
      const formattedResult =
        this.resultFormatterService.format(interpretations);

      return formattedResult;
    } catch (error) {
      this.loggingService.error('Saju analysis failed', error.stack);
      throw error;
    }
  }
}
