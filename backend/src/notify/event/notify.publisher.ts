import { getNotifyEventKey } from '@/notify/event/types/notify.key';
import {
  CommentLikeNotifyPayload,
  CommentReplyNotifyPayload,
  FollowNotifyPayload,
  FollowRequestNotifyPayload,
  NotifyPayload,
  PostCommentNotifyPayload,
  PostLikeNotifyPayload,
  SystemNotifyPayload,
} from '@/notify/event/types/notify.payload';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotifyPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * 게시글 좋아요 알림 이벤트를 발행합니다.
   */
  publishPostLikeNotify(userId: string, payload: PostLikeNotifyPayload) {
    this.publish(userId, NotificationType.POST_LIKE, payload);
  }

  /**
   * 게시글 댓글 알림 이벤트를 발행합니다.
   */
  publishCommentNofify(userId: string, payload: PostCommentNotifyPayload) {
    this.publish(userId, NotificationType.POST_COMMENT, payload);
  }

  /**
   * 댓글 좋아요 알림 이벤트를 발행합니다.
   */
  publishCommentLikeNotify(userId: string, payload: CommentLikeNotifyPayload) {
    this.publish(userId, NotificationType.COMMENT_LIKE, payload);
  }

  /**
   * 댓글 답글 알림 이벤트를 발행합니다.
   */
  publishCommentReplyNotify(userId: string, payload: CommentReplyNotifyPayload) {
    this.publish(userId, NotificationType.COMMENT_REPLY, payload);
  }

  /**
   * 팔로우 알림 이벤트를 발행합니다.
   */
  publishFollowNotify(userId: string, payload: FollowNotifyPayload) {
    this.publish(userId, NotificationType.FOLLOW, payload);
  }

  /**
   * 팔로우 요청 알림 이벤트를 발행합니다.
   */
  publishFollowRequestNotify(userId: string, payload: FollowRequestNotifyPayload) {
    this.publish(userId, NotificationType.FOLLOW_REQUEST, payload);
  }

  /**
   * 팔로우 요청 수락 알림 이벤트를 발행합니다.
   */
  publishFollowRequestAcceptedNotify(
    requesterId: string,
    payload: FollowRequestNotifyPayload,
  ) {
    this.publish(requesterId, NotificationType.FOLLOW_REQUEST_ACCEPTED, payload);
  }

  /**
   * 시스템 알림 이벤트를 발행합니다.
   */
  publishSystemNotify(userId: string, payload: SystemNotifyPayload) {
    this.publish(userId, NotificationType.SYSTEM, payload);
  }

  /**
   * 알림 이벤트를 발행합니다.
   */
  private publish(userId: string, type: NotificationType, payload: NotifyPayload) {
    const eventKey = getNotifyEventKey(type);
    this.eventEmitter.emit(eventKey, userId, payload);
  }
}
