import { Body, Controller, Post } from '@nestjs/common';
import { SajuAnalysisService } from './services/saju-analysis.service';
import { BirthInfoDto } from './dtos/birth-info.dto/birth-info.dto';
import { AnalysisResultDto } from './dtos/response/analysis-result.dto/analysis-result.dto';

// saju-analysis.controller.ts
@Controller('saju-analysis')
export class SajuAnalysisController {
  constructor(private readonly sajuAnalysisService: SajuAnalysisService) {}

  @Post('analyze')
  async analyzeSaju(
    @Body() birthInfo: BirthInfoDto,
  ): Promise<AnalysisResultDto> {
    // 1. 클라이언트로부터 생년월일시 정보 수신
    // 2. SajuAnalysisService로 분석 요청 전달
    return this.sajuAnalysisService.analyzeSaju(birthInfo);
  }
}
