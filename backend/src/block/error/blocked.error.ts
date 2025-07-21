import { ForbiddenException } from '@nestjs/common';

/**
 * 사용자가 차단한 게시글에 접근하려고 할 때 사용됩니다.
 *
 * ForbiddenException을 상속받아 HTTP 403 상태 코드를 반환합니다.
 */
export class BlockedError extends ForbiddenException {
  /**
   * @param userId - 차단된 게시글에 접근하려는 사용자 ID
   * @param targetId - 차단된 게시글의 ID
   */
  constructor(userId: string, targetId: string) {
    super(`접근할 수 없는 게시글입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'BlockedError';
  }
}
