/**
 * 게시글 좋아요 알림 이벤트 payload
 */
export interface PostLikeNotifyEvent {
  postId: string;
  viewerId: string;
}

/**
 * 게시글 댓글 알림 이벤트 payload
 */
export interface PostCommentNotifyEvent {
  commentId: string;
}

/**
 * 댓글 좋아요 알림 이벤트 payload
 */
export interface CommentLikeNotifyEvent {
  commentId: string;
  viewerId: string;
}

/**
 * 댓글 답글 알림 이벤트 payload
 */
export interface CommentReplyNotifyEvent {
  commentId: string;
  replyId: string;
}

/**
 * 팔로우 알림 이벤트 payload
 */
export interface FollowNotifyEvent {
  followerId: string;
}

/**
 * 시스템 알림 이벤트 payload
 */
export interface SystemNotifyEvent {
  title: string;
  content: string;
}

/**
 * 알림 이벤트 payload 타입
 */
export type NotifyPayload =
  | PostLikeNotifyEvent
  | PostCommentNotifyEvent
  | CommentLikeNotifyEvent
  | CommentReplyNotifyEvent
  | FollowNotifyEvent
  | SystemNotifyEvent;
