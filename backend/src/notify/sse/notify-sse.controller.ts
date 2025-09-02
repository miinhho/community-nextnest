import { User } from '@/common/decorator/user.decorator';
import { UserData } from '@/common/user';
import { Controller, OnModuleInit, Req, Sse } from '@nestjs/common';
import { ApiOperation, ApiProduces } from '@nestjs/swagger';
import { Request } from 'express';
import { NotifySseService } from './notify-sse.service';

@Controller('notify')
export class NotifySseController implements OnModuleInit {
  constructor(private readonly notifySseService: NotifySseService) {}

  /**
   * SSE 연결 초기화 및 이벤트 리스너 등록
   */
  onModuleInit() {
    this.notifySseService.initialize();
  }

  @ApiOperation({
    summary: '알림 SSE 스트림',
    description:
      '사용자의 알림을 SSE로 스트리밍합니다. 클라이언트는 이 엔드포인트를 통해 실시간으로 알림을 받을 수 있습니다.',
  })
  @Sse('sse')
  @ApiProduces('text/event-stream')
  stream(@User() { id: userId }: UserData, @Req() req: Request) {
    return this.notifySseService.createStream(userId, req);
  }
}
