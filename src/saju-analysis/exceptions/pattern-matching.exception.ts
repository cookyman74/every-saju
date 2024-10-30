// src/saju-analysis/exceptions/pattern-matching.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

export class PatternMatchingException extends HttpException {
  constructor(
    message: string,
    error?: Error,
    additionalContext?: Record<string, any>,
  ) {
    // 기본 메시지와 상태 코드를 설정합니다.
    super(
      {
        message,
        details: error ? error.message : undefined,
        additionalContext,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    // 네이티브 에러 스택을 사용하여 오류의 추적 가능성을 높입니다.
    if (error) {
      this.stack = error.stack;
    }

    // 커스텀 에러 클래스의 이름을 설정합니다.
    this.name = 'PatternMatchingException';
  }
}
