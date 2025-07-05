import { NotificationType } from '@prisma/client';

const MARK_AS_READ = 'MARK_AS_READ' as const;
const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ' as const;

// 이벤트 알림 키
export const POST_LIKE_NOTIFY = `notify.${NotificationType.POST_LIKE}`;
export const POST_COMMENT_NOTIFY = `notify.${NotificationType.POST_COMMENT}`;
export const COMMENT_LIKE_NOTIFY = `notify.${NotificationType.COMMENT_LIKE}`;
export const COMMENT_REPLY_NOTIFY = `notify.${NotificationType.COMMENT_REPLY}`;
export const FOLLOW_NOTIFY = `notify.${NotificationType.FOLLOW}`;
export const SYSTEM_NOTIFY = `notify.${NotificationType.SYSTEM}`;
export const MARK_AS_READ_NOTIFY = `notify.${MARK_AS_READ}`;
export const MARK_ALL_AS_READ_NOTIFY = `notify.${MARK_ALL_AS_READ}`;

/**
 * 알림 이벤트 키를 가져옵니다.
 */
type NotificationTypes = NotificationType | typeof MARK_AS_READ | typeof MARK_ALL_AS_READ;
export const getNotifyEventKey = (types: NotificationTypes) => `notify.${types}`;
