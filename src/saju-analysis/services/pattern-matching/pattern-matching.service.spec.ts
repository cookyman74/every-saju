import { Test, TestingModule } from '@nestjs/testing';
import { PatternMatchingService } from './pattern-matching.service';

describe('PatternMatchingService', () => {
  let service: PatternMatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatternMatchingService],
    }).compile();

    service = module.get<PatternMatchingService>(PatternMatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
