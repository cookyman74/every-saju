import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const ValidateTimeZone = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const timezone = request.body.timeZone;

    try {
      // Intl.DateTimeFormat을 사용하여 시간대 유효성 검증
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch (error) {
      throw new BadRequestException('Invalid timezone');
    }

    return timezone;
  },
);
