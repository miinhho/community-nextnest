import { NotificationType } from '@prisma/client';

// 이벤트 알림 키
export const POST_LIKE_NOTIFY = `notify.${NotificationType.POST_LIKE}` as const;
export const POST_COMMENT_NOTIFY = `notify.${NotificationType.POST_COMMENT}` as const;
export const COMMENT_LIKE_NOTIFY = `notify.${NotificationType.COMMENT_LIKE}` as const;
export const COMMENT_REPLY_NOTIFY = `notify.${NotificationType.COMMENT_REPLY}` as const;
export const FOLLOW_NOTIFY = `notify.${NotificationType.FOLLOW}` as const;
export const FOLLOW_REQUEST_NOTIFY = `notify.${NotificationType.FOLLOW_REQUEST}` as const;
export const FOLLOW_REQUEST_ACCEPT_NOTIFY =
  `notify.${NotificationType.FOLLOW_REQUEST_ACCEPTED}` as const;
export const SYSTEM_NOTIFY = `notify.${NotificationType.SYSTEM}` as const;
export const MARK_AS_READ_NOTIFY = `notify.${NotificationType.MARK_AS_READ}` as const;
export const MARK_ALL_AS_READ_NOTIFY =
  `notify.${NotificationType.MARK_ALL_AS_READ}` as const;

// 알림 이벤트 키 타입
export type NotifyEventKey =
  | typeof POST_LIKE_NOTIFY
  | typeof POST_COMMENT_NOTIFY
  | typeof COMMENT_LIKE_NOTIFY
  | typeof COMMENT_REPLY_NOTIFY
  | typeof FOLLOW_NOTIFY
  | typeof FOLLOW_REQUEST_NOTIFY
  | typeof FOLLOW_REQUEST_ACCEPT_NOTIFY
  | typeof SYSTEM_NOTIFY
  | typeof MARK_AS_READ_NOTIFY
  | typeof MARK_ALL_AS_READ_NOTIFY;

// 알림 이벤트 키 목록
export const NOTIFY_EVENT_KEYS = [
  POST_LIKE_NOTIFY,
  POST_COMMENT_NOTIFY,
  COMMENT_LIKE_NOTIFY,
  COMMENT_REPLY_NOTIFY,
  FOLLOW_NOTIFY,
  SYSTEM_NOTIFY,
] as const;

/**
 * 알림 이벤트 키를 가져옵니다.
 */
export const getNotifyEventKey = (types: NotificationType) => `notify.${types}`;
