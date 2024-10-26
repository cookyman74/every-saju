import { Test, TestingModule } from '@nestjs/testing';
import { SajuOptimizationService } from './saju-optimization.service';

describe('SajuOptimizationService', () => {
  let service: SajuOptimizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SajuOptimizationService],
    }).compile();

    service = module.get<SajuOptimizationService>(SajuOptimizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
