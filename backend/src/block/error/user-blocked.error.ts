import { ForbiddenException } from '@nestjs/common';

export class UserBlockedError extends ForbiddenException {
  constructor(userId: string, targetId: string) {
    super(`사용자가 차단한 사용자입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'UserBlockedError';
  }
}
