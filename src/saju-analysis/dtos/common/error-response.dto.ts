import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsObject, IsOptional } from 'class-validator';

export class ErrorResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: false,
  })
  success: boolean = false;

  @ApiProperty({
    description: '에러 코드',
    example: 'INVALID_BIRTH_INFO',
  })
  @IsString()
  errorCode: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '잘못된 생년월일 정보입니다.',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: '상세 에러 정보',
    type: 'object',
    required: false,
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @ApiProperty({
    description: '에러 발생 시간',
  })
  @Type(() => Date)
  timestamp: Date = new Date();

  constructor(params: {
    errorCode: string;
    message: string;
    details?: Record<string, any>;
  }) {
    this.errorCode = params.errorCode;
    this.message = params.message;
    this.details = params.details;
  }
}
