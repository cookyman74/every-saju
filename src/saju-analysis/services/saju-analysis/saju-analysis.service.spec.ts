import { Test, TestingModule } from '@nestjs/testing';
import { SajuAnalysisService } from './saju-analysis.service';

describe('SajuAnalysisService', () => {
  let service: SajuAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SajuAnalysisService],
    }).compile();

    service = module.get<SajuAnalysisService>(SajuAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
