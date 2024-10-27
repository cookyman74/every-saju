// src/saju-analysis/dtos/response/analysis-result.dto/analysis-result.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsDate,
  ValidateNested,
} from 'class-validator';

// 천간(하늘의 기운)을 나타내는 DTO
export class StemDto {
  @ApiProperty({ description: '천간 ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '천간 이름 (예: 갑,을,병,정...)' })
  @IsString()
  name: string;

  @ApiProperty({ description: '한글 이름' })
  @IsString()
  koreanName: string;

  @ApiProperty({ description: '오행 (목,화,토,금,수)' })
  @IsString()
  element: string;

  @ApiProperty({ description: '음양 구분 (true: 양, false: 음)' })
  yinYang: boolean;
}

// 지지(땅의 기운)를 나타내는 DTO
export class BranchDto {
  @ApiProperty({ description: '지지 ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '지지 이름 (예: 자,축,인,묘...)' })
  @IsString()
  name: string;

  @ApiProperty({ description: '한글 이름' })
  @IsString()
  koreanName: string;

  @ApiProperty({ description: '오행' })
  @IsString()
  element: string;

  @ApiProperty({ description: '계절 정보', required: false })
  @IsString()
  season?: string;
}

// 사주의 한 기둥(천간+지지)을 나타내는 DTO
export class PillarDto {
  @ApiProperty({ description: '천간 정보', type: StemDto })
  @ValidateNested()
  @Type(() => StemDto)
  heavenlyStem: StemDto;

  @ApiProperty({ description: '지지 정보', type: BranchDto })
  @ValidateNested()
  @Type(() => BranchDto)
  earthlyBranch: BranchDto;
}

// 사주의 네 기둥(년주, 월주, 일주, 시주)을 나타내는 DTO
export class SajuPillarDto {
  @ApiProperty({ description: '년주 (연도의 기운)', type: PillarDto })
  @ValidateNested()
  @Type(() => PillarDto)
  yearPillar: PillarDto;

  @ApiProperty({ description: '월주 (월의 기운)', type: PillarDto })
  @ValidateNested()
  @Type(() => PillarDto)
  monthPillar: PillarDto;

  @ApiProperty({ description: '일주 (일의 기운)', type: PillarDto })
  @ValidateNested()
  @Type(() => PillarDto)
  dayPillar: PillarDto;

  @ApiProperty({ description: '시주 (시간의 기운)', type: PillarDto })
  @ValidateNested()
  @Type(() => PillarDto)
  timePillar: PillarDto;
}

// 오행 분석 결과를 나타내는 DTO
export class ElementAnalysisDto {
  @ApiProperty({ description: '강한 오행들', type: [String] })
  @IsArray()
  @IsString({ each: true })
  dominant: string[];

  @ApiProperty({ description: '약한 오행들', type: [String] })
  @IsArray()
  @IsString({ each: true })
  weak: string[];

  @ApiProperty({ description: '균형 잡힌 오행들', type: [String] })
  @IsArray()
  @IsString({ each: true })
  balanced: string[];

  @ApiProperty({ description: '오행 보완 추천사항', type: [String] })
  @IsArray()
  @IsString({ each: true })
  recommendations: string[];
}

// 각 카테고리별 해석 결과를 나타내는 DTO
export class InterpretationDto {
  @ApiProperty({ description: '해석 카테고리 (예: 성격, 직업운, 건강운)' })
  @IsString()
  category: string;

  @ApiProperty({ description: '해석 내용' })
  @IsString()
  content: string;

  @ApiProperty({
    description: '해석의 신뢰도 (0-100%)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  confidence: number;
}

// 대운 기간을 나타내는 DTO
export class MajorDestinyPeriodDto {
  @ApiProperty({ description: '대운 시작 나이' })
  @IsNumber()
  startAge: number;

  @ApiProperty({ description: '대운 종료 나이' })
  @IsNumber()
  endAge: number;

  @ApiProperty({ description: '대운의 천간', type: StemDto })
  @ValidateNested()
  @Type(() => StemDto)
  stem: StemDto;

  @ApiProperty({ description: '대운의 지지', type: BranchDto })
  @ValidateNested()
  @Type(() => BranchDto)
  branch: BranchDto;
}

// 최종 분석 결과를 나타내는 DTO
export class AnalysisResultDto {
  @ApiProperty({ description: '사주 기본 정보', type: SajuPillarDto })
  @ValidateNested()
  @Type(() => SajuPillarDto)
  sajuPillar: SajuPillarDto;

  @ApiProperty({ description: '오행 분석 결과', type: ElementAnalysisDto })
  @ValidateNested()
  @Type(() => ElementAnalysisDto)
  elementAnalysis: ElementAnalysisDto;

  @ApiProperty({
    description: '카테고리별 해석 결과',
    type: [InterpretationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterpretationDto)
  interpretations: InterpretationDto[];

  @ApiProperty({ description: '분석 생성 시간' })
  @IsDate()
  @Type(() => Date)
  generatedAt: Date = new Date();
}

// 캐시 정보를 포함한 분석 결과를 나타내는 DTO
export class AnalysisResultWithCacheDto extends AnalysisResultDto {
  @ApiProperty({
    description: '캐시 관련 정보',
    type: 'object',
    example: {
      cacheHit: true,
      cachedAt: '2024-01-01T00:00:00Z',
      expiresAt: '2024-01-01T01:00:00Z',
    },
  })
  cacheInfo?: {
    cacheHit: boolean; // 캐시에서 가져온 데이터인지 여부
    cachedAt: Date; // 캐시된 시간
    expiresAt: Date; // 캐시 만료 시간
  };
}

// 실제 사례와의 유사도 분석 결과를 나타내는 DTO
export class CaseAnalysisDto {
  @ApiProperty({ description: '유사 사례 ID' })
  @IsString()
  caseId: string;

  @ApiProperty({ description: '유사도 점수 (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  similarityScore: number;

  @ApiProperty({ description: '사례 설명' })
  @IsString()
  description: string;
}

// 전체 분석 결과에 실제 사례 분석을 포함한 DTO
export class CompleteAnalysisResultDto extends AnalysisResultDto {
  @ApiProperty({ description: '실제 사례 분석 결과', type: [CaseAnalysisDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseAnalysisDto)
  caseAnalysis?: CaseAnalysisDto[];
}
