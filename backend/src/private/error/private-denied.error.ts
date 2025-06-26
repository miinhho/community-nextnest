import { ForbiddenException } from '@nestjs/common';

/**
 * 비공개 사용자의 게시글에 접근할 수 없는 경우 발생하는 예외 클래스입니다.
 * ForbiddenException을 상속받아 HTTP 403 상태 코드를 반환합니다.
 */
export class PrivateDeniedError extends ForbiddenException {
  /**
   * PrivateDeniedError 인스턴스를 생성합니다.
   *
   * @param userId - 비공개 사용자의 ID
   * @param targetId - 접근하려는 대상 게시글의 ID
   */
  constructor(userId: string, targetId: string) {
    super(
      `비공개 사용자의 게시글에 접근할 수 없습니다. userId: ${userId}, targetId: ${targetId}`,
    );
    this.name = 'PrivateAccessDeniedError';
  }
}
