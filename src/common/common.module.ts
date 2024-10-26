import { Module, Global } from '@nestjs/common';
import { DateConverterService } from './services/date-converter/date-converter.service';
import { EnhancedSajuCacheService } from './services/enhanced-saju-cache/enhanced-saju-cache.service';
import { EnhancedLoggingService } from './services/enhanced-logging/enhanced-logging.service';
import { MetricsService } from './services/metrics/metrics.service';
import { SajuUtilityService } from './services/saju-utility/saju-utility.service';
import { TimeCalibrationService } from './services/time-calibration/time-calibration.service';
import { ValidationService } from './services/validation/validation.service';

@Global()
@Module({
  providers: [
    DateConverterService,
    EnhancedSajuCacheService,
    EnhancedLoggingService,
    MetricsService,
    SajuUtilityService,
    TimeCalibrationService,
    ValidationService,
  ],
  exports: [
    DateConverterService,
    EnhancedSajuCacheService,
    EnhancedLoggingService,
    MetricsService,
    SajuUtilityService,
    TimeCalibrationService,
    ValidationService,
  ],
})
export class CommonModule {}
