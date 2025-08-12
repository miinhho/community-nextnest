import {
  COMMENT_LIKE_NOTIFY,
  COMMENT_REPLY_NOTIFY,
  FOLLOW_NOTIFY,
  FOLLOW_REQUEST_ACCEPT_NOTIFY,
  FOLLOW_REQUEST_NOTIFY,
  MARK_ALL_AS_READ_NOTIFY,
  MARK_AS_READ_NOTIFY,
  POST_COMMENT_NOTIFY,
  POST_LIKE_NOTIFY,
  SYSTEM_NOTIFY,
} from '@/notify/event/types/notify.key';
import {
  CommentLikeNotifyPayload,
  CommentReplyNotifyPayload,
  FollowNotifyPayload,
  FollowRequestAcceptedNotifyPayload,
  FollowRequestNotifyPayload,
  PostCommentNotifyPayload,
  PostLikeNotifyPayload,
  SystemNotifyPayload,
} from '@/notify/event/types/notify.payload';
import { NotifyRepository } from '@/notify/notify.repository';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotifyEventListener {
  constructor(private readonly notifyRepository: NotifyRepository) {}

  /**
   * 게시글 좋아요 알림을 처리합니다.
   */
  @OnEvent(POST_LIKE_NOTIFY)
  async handlePostLikeNotify(userId: string, payload: PostLikeNotifyPayload) {
    await this.notifyRepository.createPostLikeNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 게시글 댓글 알림을 처리합니다.
   */
  @OnEvent(POST_COMMENT_NOTIFY)
  async handlePostCommentNotify(userId: string, payload: PostCommentNotifyPayload) {
    await this.notifyRepository.createCommentNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 댓글 좋아요 알림을 처리합니다.
   */
  @OnEvent(COMMENT_LIKE_NOTIFY)
  async handleCommentLikeNotify(userId: string, payload: CommentLikeNotifyPayload) {
    await this.notifyRepository.createCommentLikeNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 댓글 답글 알림을 처리합니다.
   */
  @OnEvent(COMMENT_REPLY_NOTIFY)
  async handleCommentReplyNotify(userId: string, payload: CommentReplyNotifyPayload) {
    await this.notifyRepository.createReplyNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 팔로우 알림을 처리합니다.
   */
  @OnEvent(FOLLOW_NOTIFY)
  async handleFollowNotify(userId: string, payload: FollowNotifyPayload) {
    await this.notifyRepository.createFollowNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 팔로우 요청 알림을 처리합니다.
   */
  @OnEvent(FOLLOW_REQUEST_NOTIFY)
  async handleFollowRequestNotify(userId: string, payload: FollowRequestNotifyPayload) {
    await this.notifyRepository.createFollowRequestNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 팔로우 요청 수락 알림을 처리합니다.
   */
  @OnEvent(FOLLOW_REQUEST_ACCEPT_NOTIFY)
  async handleFollowRequestAcceptedNotify(
    requesterId: string,
    payload: FollowRequestAcceptedNotifyPayload,
  ) {
    await this.notifyRepository.createFollowAcceptNotify({
      requesterId,
      ...payload,
    });
  }

  /**
   * 시스템 알림을 처리합니다.
   */
  @OnEvent(SYSTEM_NOTIFY)
  async handleSystemNotify(userId: string, payload: SystemNotifyPayload) {
    await this.notifyRepository.createSystemNotify({
      userId,
      ...payload,
    });
  }

  /**
   * 알림을 읽음 처리합니다.
   */
  @OnEvent(MARK_AS_READ_NOTIFY)
  async handleMarkAsRead(userId: string, notifyId: string) {
    await this.notifyRepository.markAsRead(notifyId, userId);
  }

  /**
   * 사용자의 모든 알림을 읽음 처리합니다.
   */
  @OnEvent(MARK_ALL_AS_READ_NOTIFY)
  async handleMarkAllAsRead(userId: string) {
    await this.notifyRepository.markAllAsRead(userId);
  }
}
