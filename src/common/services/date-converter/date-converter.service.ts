import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DateConverterService {
  constructor(private readonly configService: ConfigService) {}

  async convertSolarToLunar(date: Date): Promise<Date> {
    // 양력을 음력으로 변환하는 로직 구현
    return date; // 임시 반환
  }

  async convertLunarToSolar(date: Date): Promise<Date> {
    // 음력을 양력으로 변환하는 로직 구현
    return date; // 임시 반환
  }

  calculateTimeGap(date: Date, timezone: string): number {
    // 시간대 차이 계산 로직 구현
    return 0; // 임시 반환
  }
}
