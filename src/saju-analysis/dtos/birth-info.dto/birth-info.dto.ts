import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsTimeZone,
} from 'class-validator';

export class LocationDto {
  @ApiProperty({
    description: '위도',
    example: 37.5665,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.978,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: '고도(미터)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(-500)
  @Max(9000)
  altitude?: number;
}

export class BirthInfoDto {
  @ApiProperty({
    description: '양력 생년월일시',
    example: '2024-01-01T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  solarDate: Date;

  @ApiProperty({
    description: '음력 생년월일시',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lunarDate?: Date;

  @ApiProperty({
    description: '시간대',
    example: 'Asia/Seoul',
  })
  @IsString()
  @IsTimeZone()
  timeZone: string;

  @ApiProperty({
    description: '윤달 여부',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isLeapMonth?: boolean;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
