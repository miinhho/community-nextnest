import {
  MARK_ALL_AS_READ_NOTIFY,
  MARK_AS_READ_NOTIFY,
  NOTIFY_EVENT_KEYS,
} from '@/notify/event/types/notify.key';
import { NotifyPayload } from '@/notify/event/types/notify.payload';
import { NotifyMaxSseError } from '@/notify/sse/error/notify-max-sse.error';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { interval, map, merge, Subject, takeUntil } from 'rxjs';

export interface NotifyMessage {
  type: string;
  data: any;
}

const MAX_SSE_CONNECTIONS = 10;

@Injectable()
export class NotifySseService {
  private readonly logger = new Logger(NotifySseService.name);

  private clients = new Map<string, Set<Subject<NotifyMessage>>>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * SSE 연결 초기화 및 이벤트 리스너 등록
   */
  initialize() {
    for (const event of NOTIFY_EVENT_KEYS) {
      this.eventEmitter.on(event, (userId: string, payload: NotifyPayload) => {
        this.emitToUser(userId, {
          type: event,
          data: payload,
        });
      });
    }

    this.eventEmitter.on(MARK_AS_READ_NOTIFY, (userId: string, notifyId: string) => {
      this.emitToUser(userId, {
        type: MARK_AS_READ_NOTIFY,
        data: { notifyId },
      });
    });

    this.eventEmitter.on(MARK_ALL_AS_READ_NOTIFY, (userId: string) => {
      this.emitToUser(userId, {
        type: MARK_ALL_AS_READ_NOTIFY,
        data: true,
      });
    });
  }

  /**
   * SSE 연결을 통해 클라이언트에게 알림 메시지를 전송합니다.
   */
  private emitToUser(userId: string, message: NotifyMessage) {
    const set = this.clients.get(userId);
    if (!set || set.size === 0) return;

    for (const subject of set) {
      subject.next(message);
    }
  }

  /**
   * SSE 스트림을 생성합니다.
   */
  createStream(userId: string, req: Request) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    const set = this.clients.get(userId)!;

    if (set.size >= MAX_SSE_CONNECTIONS) {
      throw new NotifyMaxSseError();
    }

    const subject = new Subject<NotifyMessage>();
    set.add(subject);

    // 연결 종료 감지 및 정리
    const close$ = new Subject<void>();
    req.on('close', () => {
      this.cleanupClient(userId, subject);
      close$.next();
      close$.complete();
    });

    // keepalive (nginx 65초 타임아웃 방지)
    const keepalive$ = interval(30 * 1000).pipe(
      takeUntil(close$),
      map(() => ({ type: 'keepalive', data: true })),
    );

    return merge(subject.asObservable(), keepalive$);
  }

  /**
   * SSE 연결을 해제하고 클라이언트 정보를 정리합니다.
   */
  private cleanupClient(userId: string, subject: Subject<NotifyMessage>) {
    const set = this.clients.get(userId);
    if (!set) return;

    set.delete(subject);
    subject.complete();

    if (set.size === 0) {
      this.clients.delete(userId);
    }

    this.logger.log(`SSE 연결 해제: userId=${userId}`);
  }
}
