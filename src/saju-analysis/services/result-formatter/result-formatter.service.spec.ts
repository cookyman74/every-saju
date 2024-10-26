import { Test, TestingModule } from '@nestjs/testing';
import { ResultFormatterService } from './result-formatter.service';

describe('ResultFormatterService', () => {
  let service: ResultFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultFormatterService],
    }).compile();

    service = module.get<ResultFormatterService>(ResultFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
