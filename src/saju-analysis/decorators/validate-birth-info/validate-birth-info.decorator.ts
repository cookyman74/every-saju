import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const ValidateBirthInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const birthInfo = request.body;

    // 필수 필드 검증
    if (!birthInfo.solarDate || !birthInfo.timeZone || !birthInfo.location) {
      throw new BadRequestException('Missing required birth information');
    }

    // 날짜 형식 검증
    const date = new Date(birthInfo.solarDate);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // 위치 정보 검증
    if (!birthInfo.location.latitude || !birthInfo.location.longitude) {
      throw new BadRequestException('Invalid location information');
    }

    // 위도 범위 검증 (-90 ~ 90)
    if (birthInfo.location.latitude < -90 || birthInfo.location.latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    // 경도 범위 검증 (-180 ~ 180)
    if (
      birthInfo.location.longitude < -180 ||
      birthInfo.location.longitude > 180
    ) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }

    return birthInfo;
  },
);
