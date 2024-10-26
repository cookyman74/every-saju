import { Test, TestingModule } from '@nestjs/testing';
import { DateConverterService } from './date-converter.service';

describe('DateConverterService', () => {
  let service: DateConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateConverterService],
    }).compile();

    service = module.get<DateConverterService>(DateConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
