import { BadRequestException } from '@nestjs/common';

/**
 * 이미 팔로우한 사용자를 다시 팔로우하려고 할 때 발생하는 예외 클래스
 *
 * BadRequestException을 상속받아 HTTP 400 상태 코드를 반환합니다.
 */
export class AlreadyFollowError extends BadRequestException {
  /**
   * AlreadyFollowError 인스턴스를 생성합니다.
   *
   * @param userId - 팔로우를 요청한 사용자 ID
   * @param targetId - 이미 팔로우된 대상 사용자 ID
   */
  constructor(userId: string, targetId: string) {
    super(`이미 팔로우를 한 유저입니다. userId: ${userId}, targetId: ${targetId}`);
    this.name = 'AlreadyFollowError';
  }
}
