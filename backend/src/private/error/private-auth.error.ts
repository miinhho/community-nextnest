import { UnauthorizedException } from '@nestjs/common';

/**
 * 비공개 사용자의 게시글에 접근하기 위해 인증이 필요한 경우 발생하는 예외 클래스입니다.
 * UnauthorizedException을 상속받아 HTTP 401 상태 코드를 반환합니다.
 */
export class PrivateAuthError extends UnauthorizedException {
  constructor() {
    super('비공개 사용자의 게시글에 접근하기 위해 인증이 필요합니다.');
    this.name = 'PrivateAuthError';
  }
}
