import { ForbiddenException } from '@nestjs/common';

export class BlockedError extends ForbiddenException {
  constructor(userId: string, targetId: string) {
    super(`접근할 수 없는 게시글입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'BlockedError';
  }
}
