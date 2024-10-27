import { Injectable } from '@nestjs/common';
import { PatternMatchingService } from './pattern-matching/pattern-matching.service';
import { InterpretationComposerService } from './interpretation-composer/interpretation-composer.service';
import { ResultFormatterService } from './result-formatter/result-formatter.service';

// todo: 여기서부터 봐야...
@Injectable()
export class SajuAnalysisService {
  constructor(
    private readonly patternMatching: PatternMatchingService,
    private readonly interpretationComposer: InterpretationComposerService,
    private readonly resultFormatter: ResultFormatterService,
  ) {}

  async analyzeSaju(birthInfo: any) {
    try {
      // 1. 패턴 매칭
      const patterns = await await this.patternMatching.findMatches(birthInfo);

      // 2. 해석 조합
      const interpretations =
        await this.interpretationComposer.compose(patterns);

      // 3. 결과 포맷팅
      return this.resultFormatter.format(interpretations);
    } catch (error) {
      this.loggingService.error('Saju analysis failed', error.stack);
      throw error;
    }
  }
}
