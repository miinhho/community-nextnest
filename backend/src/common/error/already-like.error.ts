import { BadRequestException } from '@nestjs/common';

/**
 * 이미 좋아요를 눌렀지만 다시 좋아요를 시도할 때 발생하는 예외 클래스
 *
 * BadRequestException을 상속받아 HTTP 400 상태 코드를 반환합니다.
 */
export class AlreadyLikeError extends BadRequestException {
  /**
   * @param targetId - 좋아요를 시도한 엔티티의 ID
   * @param userId - 좋아요를 시도한 사용자 ID
   */
  constructor(targetId: string, userId: string) {
    super(`이미 좋아요를 눌렀습니다. targetId: ${targetId}, userId: ${userId}`);
    this.name = 'AlreadyLikeError';
  }
}
