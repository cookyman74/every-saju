import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

// 캐시 설정에 관한 정보를 담는 DTO입니다.
export class CacheConfigDto {
  // 캐시 유지 시간 설정 (초 단위)
  @ApiProperty({
    description: '캐시 유지 시간(초)', // API 문서에 표시될 설명
    minimum: 0, // 최소값 설정
    default: 3600, // 기본값 1시간 (3600초)
    required: false, // 필수 입력값이 아님
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsNumber() // 숫자만 허용
  @Min(0) // 최소값은 0
  @Max(86400) // 최대값은 24시간 (86400초)
  ttl?: number; // 캐시 유지 시간

  // 캐시 사용 여부
  @ApiProperty({
    description: '캐시 사용 여부', // API 문서에 표시될 설명
    default: true, // 기본값은 true
    required: false, // 필수 입력값이 아님
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsBoolean() // true/false 값만 허용
  useCache?: boolean; // 캐시 사용 여부

  // 캐시 그룹 설정
  @ApiProperty({
    description: '캐시 그룹 이름', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsString() // 문자열만 허용
  cacheGroup?: string; // 캐시 그룹 이름
}
