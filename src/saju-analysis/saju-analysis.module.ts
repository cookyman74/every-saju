import { Module } from '@nestjs/common';
import { SajuAnalysisController } from './saju-analysis.controller';
import { SajuAnalysisService } from './services/saju-analysis.service';
import { SajuOptimizationService } from './services/saju-optimization/saju-optimization.service';
import { PatternMatchingService } from './services/pattern-matching/pattern-matching.service';
import { InterpretationComposerService } from './services/interpretation-composer/interpretation-composer.service';
import { ResultFormatterService } from './services/result-formatter/result-formatter.service';
import { InterpretationRepository } from './repositories/interpretation.repository/interpretation.repository';
import { SolarTermsRepository } from './repositories/solar-terms.repository/solar-terms.repository';
import { TimeCorrectionRepository } from './repositories/time-correction.repository/time-correction.repository';

@Module({
  controllers: [SajuAnalysisController],
  providers: [
    SajuAnalysisService,
    SajuOptimizationService,
    PatternMatchingService,
    InterpretationComposerService,
    ResultFormatterService,
    InterpretationRepository,
    SolarTermsRepository,
    TimeCorrectionRepository,
  ],
  exports: [SajuAnalysisService],
})
export class SajuAnalysisModule {}
