import { Test, TestingModule } from '@nestjs/testing';
import { EnhancedLoggingService } from './enhanced-logging.service';

describe('EnhancedLoggingService', () => {
  let service: EnhancedLoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnhancedLoggingService],
    }).compile();

    service = module.get<EnhancedLoggingService>(EnhancedLoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
