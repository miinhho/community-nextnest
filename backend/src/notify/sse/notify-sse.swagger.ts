import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiProduces } from '@nestjs/swagger';

export const ApiNotifySse = () =>
  applyDecorators(
    ApiOperation({
      summary: '알림 SSE 스트림',
      description:
        '사용자의 알림을 SSE로 스트리밍합니다. 클라이언트는 이 엔드포인트를 통해 실시간으로 알림을 받을 수 있습니다.',
    }),
    ApiProduces('text/event-stream'),
  );
