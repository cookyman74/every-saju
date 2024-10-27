import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { BaseResponseDto } from './response.dto';

export class PaginationMetaDto {
  @ApiProperty({
    description: '전체 아이템 수',
    example: 100,
  })
  @IsNumber()
  totalItems: number;

  @ApiProperty({
    description: '페이지당 아이템 수',
    example: 10,
  })
  @IsNumber()
  itemsPerPage: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 10,
  })
  @IsNumber()
  totalPages: number;

  @ApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    description: '다음 페이지 존재 여부',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: '이전 페이지 존재 여부',
    example: false,
  })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty({
    description: '페이지네이션 메타 정보',
    type: PaginationMetaDto,
  })
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @ApiProperty({ description: '페이지 데이터' })
  @IsArray()
  data: T[];

  constructor(data: T[], meta: PaginationMetaDto, message: string = '성공') {
    super(data, message);
    this.meta = meta;
  }
}
