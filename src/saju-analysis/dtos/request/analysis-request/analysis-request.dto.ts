import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { BirthInfoDto } from '../../birth-info.dto/birth-info.dto';
import { CacheConfigDto } from '../cache-config/cache-config.dto';

// 사주 분석을 요청할 때 사용하는 DTO (데이터 전송 객체)입니다.
export class AnalysisRequestDto {
  // 출생 정보를 담는 부분
  @ApiProperty({
    description: '출생 정보', // API 문서에 표시될 설명
    type: BirthInfoDto, // 데이터 타입 지정
  })
  @ValidateNested() // 중첩된 객체의 유효성도 검사하라는 표시
  @Type(() => BirthInfoDto) // 실제 데이터를 BirthInfoDto 타입으로 변환
  birthInfo: BirthInfoDto; // 출생 정보를 담는 변수

  // 캐시 설정 정보 (선택사항)
  @ApiProperty({
    description: '캐시 설정', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    type: CacheConfigDto, // 데이터 타입 지정
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @ValidateNested() // 중첩된 객체의 유효성도 검사
  @Type(() => CacheConfigDto) // 실제 데이터를 CacheConfigDto 타입으로 변환
  cacheConfig?: CacheConfigDto; // ? 표시는 이 필드가 없어도 된다는 의미

  // 상세 분석 포함 여부 (선택사항)
  @ApiProperty({
    description: '상세 분석 포함 여부', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    default: false, // 기본값은 false
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsBoolean() // true/false 값만 허용
  includeDetailedAnalysis?: boolean;
}
