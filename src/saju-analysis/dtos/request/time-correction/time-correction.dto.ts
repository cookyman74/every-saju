import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsOptional, ValidateNested } from 'class-validator';
import { LocationDto } from '../../birth-info.dto/birth-info.dto';

// 시간 보정 요청을 처리하기 위한 DTO입니다.
export class TimeCorrectionRequestDto {
  // 보정할 날짜와 시간
  @ApiProperty({
    description: '보정할 날짜/시간', // API 문서에 표시될 설명
    example: '2024-01-01T12:00:00Z', // 예시 값
  })
  @IsDate() // 날짜 형식만 허용
  @Type(() => Date) // 문자열을 Date 객체로 변환
  datetime: Date; // 날짜와 시간 정보

  // 위치 정보
  @ApiProperty({
    description: '위치 정보', // API 문서에 표시될 설명
    type: LocationDto, // 데이터 타입 지정
  })
  @ValidateNested() // 중첩된 객체의 유효성도 검사
  @Type(() => LocationDto) // LocationDto 타입으로 변환
  location: LocationDto; // 위치 정보

  // 절기 ID (선택사항)
  @ApiProperty({
    description: '절기 ID', // API 문서에 표시될 설명
    required: false, // 필수 입력값이 아님
    example: 'spring-equinox', // 예시 값
  })
  @IsOptional() // 이 필드는 선택사항임을 표시
  @IsString() // 문자열만 허용
  solarTermId?: string; // 절기 ID
}
