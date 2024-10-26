import { Test, TestingModule } from '@nestjs/testing';
import { InterpretationComposerService } from './interpretation-composer.service';

describe('InterpretationComposerService', () => {
  let service: InterpretationComposerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterpretationComposerService],
    }).compile();

    service = module.get<InterpretationComposerService>(InterpretationComposerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
