import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class BaseResponseDto<T> {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: '응답 생성 시간',
  })
  @IsDate()
  @Type(() => Date)
  timestamp: Date = new Date();

  @ApiProperty({
    description: '응답 데이터',
    required: false,
  })
  @IsOptional()
  data?: T;

  constructor(data?: T, message: string = '성공') {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
