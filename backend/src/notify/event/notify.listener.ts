import {
  COMMENT_LIKE_NOTIFY,
  COMMENT_REPLY_NOTIFY,
  FOLLOW_NOTIFY,
  MARK_ALL_AS_READ_NOTIFY,
  MARK_AS_READ_NOTIFY,
  POST_COMMENT_NOTIFY,
  POST_LIKE_NOTIFY,
  SYSTEM_NOTIFY,
} from '@/notify/event/types/notify.key';
import {
  CommentLikeNotifyEvent,
  CommentReplyNotifyEvent,
  FollowNotifyEvent,
  PostCommentNotifyEvent,
  PostLikeNotifyEvent,
  SystemNotifyEvent,
} from '@/notify/event/types/notify.payload';
import { NotifyService } from '@/notify/notify.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotifyEventListener {
  constructor(private readonly notifyService: NotifyService) {}

  /**
   * 게시글 좋아요 알림을 처리합니다.
   */
  @OnEvent(POST_LIKE_NOTIFY)
  async handlePostLikeNotify(userId: string, payload: PostLikeNotifyEvent) {
    await this.notifyService.createPostLikeNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 게시글 댓글 알림을 처리합니다.
   */
  @OnEvent(POST_COMMENT_NOTIFY)
  async handlePostCommentNotify(userId: string, payload: PostCommentNotifyEvent) {
    await this.notifyService.createCommentNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 댓글 좋아요 알림을 처리합니다.
   */
  @OnEvent(COMMENT_LIKE_NOTIFY)
  async handleCommentLikeNotify(userId: string, payload: CommentLikeNotifyEvent) {
    await this.notifyService.createCommentLikeNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 댓글 답글 알림을 처리합니다.
   */
  @OnEvent(COMMENT_REPLY_NOTIFY)
  async handleCommentReplyNotify(userId: string, payload: CommentReplyNotifyEvent) {
    await this.notifyService.createReplyNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 팔로우 알림을 처리합니다.
   */
  @OnEvent(FOLLOW_NOTIFY)
  async handleFollowNotify(userId: string, payload: FollowNotifyEvent) {
    await this.notifyService.createFollowNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 시스템 알림을 처리합니다.
   */
  @OnEvent(SYSTEM_NOTIFY)
  async handleSystemNotify(userId: string, payload: SystemNotifyEvent) {
    await this.notifyService.createSystemNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 알림을 읽음 처리합니다.
   */
  @OnEvent(MARK_AS_READ_NOTIFY)
  async handleMarkAsRead(userId: string, notifyId: string) {
    await this.notifyService.markAsRead(notifyId, userId);
  }

  /**
   * 사용자의 모든 알림을 읽음 처리합니다.
   */
  @OnEvent(MARK_ALL_AS_READ_NOTIFY)
  async handleMarkAllAsRead(userId: string) {
    await this.notifyService.markAllAsRead(userId);
  }
}
