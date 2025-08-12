import { getNotifyEventKey } from '@/notify/event/types/notify.key';
import { NotifyPayload } from '@/notify/event/types/notify.payload';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotifyPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * 알림 이벤트를 발행합니다.
   */
  publish(userId: string, type: NotificationType, payload: NotifyPayload) {
    const eventKey = getNotifyEventKey(type);
    this.eventEmitter.emit(eventKey, userId, payload);
  }
}
