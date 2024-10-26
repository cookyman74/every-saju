// src/saju-analysis/dtos/birth-info.dto.ts
import { IsDate, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BirthInfoDto {
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsString()
  timeZone: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
