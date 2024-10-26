import { Test, TestingModule } from '@nestjs/testing';
import { SajuUtilityService } from './saju-utility.service';

describe('SajuUtilityService', () => {
  let service: SajuUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SajuUtilityService],
    }).compile();

    service = module.get<SajuUtilityService>(SajuUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
