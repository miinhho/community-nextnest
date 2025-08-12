/**
 * 게시글 좋아요 알림 이벤트 payload
 */
export interface PostLikeNotifyPayload {
  postId: string;
  viewerId: string;
}

/**
 * 게시글 댓글 알림 이벤트 payload
 */
export interface PostCommentNotifyPayload {
  commentId: string;
}

/**
 * 댓글 좋아요 알림 이벤트 payload
 */
export interface CommentLikeNotifyPayload {
  commentId: string;
  viewerId: string;
}

/**
 * 댓글 답글 알림 이벤트 payload
 */
export interface CommentReplyNotifyPayload {
  commentId: string;
  replyId: string;
}

/**
 * 팔로우 알림 이벤트 payload
 */
export interface FollowNotifyPayload {
  followerId: string;
}

/**
 * 팔로우 요청 알림 이벤트 payload
 */
export interface FollowRequestNotifyPayload {
  requesterId: string;
}

/**
 * 팔로우 요청 수락 알림 이벤트 payload
 */
export interface FollowRequestAcceptedNotifyPayload {
  accepterId: string;
}

/**
 * 시스템 알림 이벤트 payload
 */
export interface SystemNotifyPayload {
  title: string;
  content: string;
}

/**
 * 알림 이벤트 payload 타입
 */
export type NotifyPayload =
  | PostLikeNotifyPayload
  | PostCommentNotifyPayload
  | CommentLikeNotifyPayload
  | CommentReplyNotifyPayload
  | FollowNotifyPayload
  | FollowRequestNotifyPayload
  | FollowRequestAcceptedNotifyPayload
  | SystemNotifyPayload;
