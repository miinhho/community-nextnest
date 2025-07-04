import { ForbiddenException } from '@nestjs/common';

export class PrivateUserError extends ForbiddenException {
  constructor() {
    super('비공개 사용자입니다.');
    this.name = 'PrivateUserError';
  }
}
