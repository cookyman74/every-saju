import { Test, TestingModule } from '@nestjs/testing';
import { TimeCalibrationService } from './time-calibration.service';

describe('TimeCalibrationService', () => {
  let service: TimeCalibrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeCalibrationService],
    }).compile();

    service = module.get<TimeCalibrationService>(TimeCalibrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
