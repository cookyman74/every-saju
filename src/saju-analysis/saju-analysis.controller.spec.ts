import { Test, TestingModule } from '@nestjs/testing';
import { SajuAnalysisController } from './saju-analysis.controller';

describe('SajuAnalysisController', () => {
  let controller: SajuAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SajuAnalysisController],
    }).compile();

    controller = module.get<SajuAnalysisController>(SajuAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
