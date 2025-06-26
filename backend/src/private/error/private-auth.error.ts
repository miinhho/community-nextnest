import { UnauthorizedException } from '@nestjs/common';

export class PrivateAuthError extends UnauthorizedException {
  constructor() {
    super('비공개 사용자의 게시글에 접근하기 위해 인증이 필요합니다.');
    this.name = 'PrivateAuthError';
  }
}
