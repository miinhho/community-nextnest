import {
  CommentLikeNotifyEvent,
  CommentReplyNotifyEvent,
  FollowNotifyEvent,
  PostCommentNotifyEvent,
  PostLikeNotifyEvent,
  SystemNotifyEvent,
} from '@/notify/event/notify.event';
import {
  COMMENT_LIKE_NOTIFY,
  COMMENT_REPLY_NOTIFY,
  FOLLOW_NOTIFY,
  POST_COMMENT_NOTIFY,
  POST_LIKE_NOTIFY,
  SYSTEM_NOTIFY,
} from '@/notify/event/notify.key';
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
  async handlePostLikeNotify(payload: PostLikeNotifyEvent) {
    await this.notifyService.createPostLikeNotify(payload);
  }

  /**
   * 게시글 댓글 알림을 처리합니다.
   */
  @OnEvent(POST_COMMENT_NOTIFY)
  async handlePostCommentNotify(payload: PostCommentNotifyEvent) {
    await this.notifyService.createCommentNotify(payload);
  }

  /**
   * 댓글 좋아요 알림을 처리합니다.
   */
  @OnEvent(COMMENT_LIKE_NOTIFY)
  async handleCommentLikeNotify(payload: CommentLikeNotifyEvent) {
    await this.notifyService.createCommentLikeNotify(payload);
  }

  /**
   * 댓글 답글 알림을 처리합니다.
   */
  @OnEvent(COMMENT_REPLY_NOTIFY)
  async handleCommentReplyNotify(payload: CommentReplyNotifyEvent) {
    await this.notifyService.createReplyNotify(payload);
  }

  /**
   * 팔로우 알림을 처리합니다.
   */
  @OnEvent(FOLLOW_NOTIFY)
  async handleFollowNotify(payload: FollowNotifyEvent) {
    await this.notifyService.createFollowNotify(payload);
  }

  /**
   * 시스템 알림을 처리합니다.
   */
  @OnEvent(SYSTEM_NOTIFY)
  async handleSystemNotify(payload: SystemNotifyEvent) {
    await this.notifyService.createSystemNotify(payload);
  }
}
