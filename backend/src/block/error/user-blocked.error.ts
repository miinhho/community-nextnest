import { ForbiddenException } from '@nestjs/common';

/**
 * 사용자가 차단한 사용자에 대한 예외 클래스
 * 차단된 사용자가 접근하려고 할 때 발생합니다.
 *
 * ForbiddenException을 상속받아 HTTP 403 상태 코드를 반환합니다.
 */
export class UserBlockedError extends ForbiddenException {
  /**
   * UserBlockedError 인스턴스를 생성합니다.
   *
   * @param userId - 차단된 사용자의 ID
   * @param targetId - 차단한 대상 사용자의 ID
   */
  constructor(userId: string, targetId: string) {
    super(`사용자가 차단한 사용자입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'UserBlockedError';
  }
}
