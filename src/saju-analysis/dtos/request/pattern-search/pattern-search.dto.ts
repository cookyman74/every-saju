import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

// 해석 패턴을 검색할 때 사용하는 DTO입니다.
export class PatternSearchDto {
  // 검색 조건
  @ApiProperty({
    description: '검색할 패턴 조건', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    type: 'object', // 객체 타입임을 표시
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  conditions?: Record<string, any>; // 어떤 키와 값도 받을 수 있는 객체

  // 페이지 번호
  @ApiProperty({
    description: '페이지 번호', // API 문서에 표시될 설명
    minimum: 1, // 최소값은 1
    default: 1, // 기본값은 1
    required: false, // 필수 입력값이 아님
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsNumber() // 숫자만 허용
  @Min(1) // 최소값은 1
  @Type(() => Number) // 문자열로 들어온 숫자를 숫자 타입으로 변환
  page?: number = 1; // 페이지 번호 (기본값 1)

  // 페이지당 항목 수
  @ApiProperty({
    description: '페이지당 항목 수', // API 문서에 표시될 설명
    minimum: 1, // 최소값은 1
    maximum: 100, // 최대값은 100
    default: 20, // 기본값은 20
    required: false, // 필수 입력값이 아님
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsNumber() // 숫자만 허용
  @Min(1) // 최소값은 1
  @Max(100) // 최대값은 100
  @Type(() => Number) // 문자열로 들어온 숫자를 숫자 타입으로 변환
  pageSize?: number = 20; // 페이지당 항목 수 (기본값 20)

  // 정렬 기준
  @ApiProperty({
    description: '정렬 기준 필드', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    example: 'createdAt', // 예시 값
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsString() // 문자열만 허용
  sortBy?: string; // 정렬 기준 필드명

  // 정렬 방향
  @ApiProperty({
    description: '정렬 방향', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    enum: ['ASC', 'DESC'], // 가능한 값들
    default: 'DESC', // 기본값은 내림차순
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsString() // 문자열만 허용
  sortDirection?: 'ASC' | 'DESC' = 'DESC'; // 정렬 방향 (기본값 DESC)
}
