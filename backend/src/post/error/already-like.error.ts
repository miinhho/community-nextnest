import { BadRequestException } from '@nestjs/common';

export class AlreadyLikeError extends BadRequestException {
  constructor(postId: string, userId: string) {
    super(`이미 좋아요를 누른 게시글입니다. postId: ${postId}, userId: ${userId}`);
    this.name = 'AlreadyLikeError';
  }
}
