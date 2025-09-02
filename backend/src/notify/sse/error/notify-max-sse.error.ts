import { BadRequestException } from '@nestjs/common';

export class NotifyMaxSseError extends BadRequestException {
  constructor() {
    super('최대 SSE 연결 수에 도달했습니다.');
    this.name = 'NotifyMaxSseError';
  }
}
