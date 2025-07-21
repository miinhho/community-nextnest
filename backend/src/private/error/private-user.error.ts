import { ForbiddenException } from '@nestjs/common';

/**
 * 비공개 사용자에 대한 접근이 거부된 경우 발생하는 예외 클래스입니다.
 *
 * ForbiddenException을 상속받아 HTTP 403 상태 코드를 반환합니다.
 */
export class PrivateUserError extends ForbiddenException {
  constructor() {
    super('비공개 사용자입니다.');
    this.name = 'PrivateUserError';
  }
}
