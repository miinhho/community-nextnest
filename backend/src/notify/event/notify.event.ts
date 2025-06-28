/**
 * 게시글 좋아요 알림 이벤트 payload
 */
export class PostLikeNotifyEvent {
  userId: string;
  postId: string;
  viewerId: string;
}

/**
 * 게시글 댓글 알림 이벤트 payload
 */
export class PostCommentNotifyEvent {
  userId: string;
  commentId: string;
}

/**
 * 댓글 좋아요 알림 이벤트 payload
 */
export class CommentLikeNotifyEvent {
  userId: string;
  commentId: string;
  viewerId: string;
}

/**
 * 댓글 답글 알림 이벤트 payload
 */
export class CommentReplyNotifyEvent {
  userId: string;
  commentId: string;
  replyId: string;
}

/**
 * 팔로우 알림 이벤트 payload
 */
export class FollowNotifyEvent {
  userId: string;
  followerId: string;
}

/**
 * 시스템 알림 이벤트 payload
 */
export class SystemNotifyEvent {
  userId: string;
  title: string;
  content: string;
}
