import { ForbiddenException } from '@nestjs/common';

export class PrivateDeniedError extends ForbiddenException {
  constructor(userId: string, targetId: string) {
    super(
      `비공개 사용자의 게시글에 접근할 수 없습니다. userId: ${userId}, targetId: ${targetId}`,
    );
    this.name = 'PrivateAccessDeniedError';
  }
}
