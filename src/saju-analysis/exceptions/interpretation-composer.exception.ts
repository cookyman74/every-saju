// src/saju-analysis/exceptions/interpretation-composer.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * InterpretationComposerException은 해석 조합 과정에서 발생하는 예외를 처리하기 위한 사용자 정의 예외 클래스입니다.
 * @extends HttpException
 */
export class InterpretationComposerException extends HttpException {
  /**
   * 예외를 생성하는 생성자입니다.
   * @param message - 예외 메시지
   * @param cause - 원인 예외 (선택 사항)
   * @param context - 예외 발생 상황 정보 (선택 사항)
   */
  constructor(message: string, cause?: Error, context?: any) {
    // HTTP 상태 코드 설정 (500: 내부 서버 오류)
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Interpretation Composer Error',
        message,
        context,
        cause: cause ? cause.message : undefined,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    // 원인 예외의 스택 정보를 포함
    if (cause && cause.stack) {
      this.stack = cause.stack;
    }

    // 추가적인 예외 상황 정보를 로깅하기 위해 context 정보가 주어지면 로깅
    if (context) {
      console.error(`InterpretationComposerException context:`, context);
    }
  }
}
