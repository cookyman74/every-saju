import {
  BirthInfoDto,
  LocationDto,
} from '../dtos/birth-info.dto/birth-info.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BirthInfoValidator {
  validate(birthInfo: BirthInfoDto): ValidationResult {
    return {
      isValid:
        this.validateBirthDate(birthInfo) &&
        this.validateLocation(birthInfo.location) &&
        this.validateTimeZone(birthInfo.timeZone),
      errors: this.collectErrors(birthInfo),
    };
  }

  private validateBirthDate(birthInfo: BirthInfoDto): boolean {
    // 생년월일 유효성 검증
    return true;
  }

  private validateLocation(location: LocationDto): boolean {
    // 위치 정보 유효성 검증
    return true;
  }

  private validateTimeZone(timeZone: string) {
    return false;
  }

  private collectErrors(birthInfo: BirthInfoDto) {}
}
