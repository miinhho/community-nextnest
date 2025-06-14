import { BadRequestException } from '@nestjs/common';

export class AlreadyFollowError extends BadRequestException {
  constructor(userId: string, targetId: string) {
    super(`이미 팔로우를 한 유저입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'AlreadyFollowError';
  }
}
