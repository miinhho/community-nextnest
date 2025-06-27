/**
 * 게시글 내용의 길이 제한을 정의하는 상수
 */
export const CONTENT_LEN = {
  /** 게시글 내용 최소 길이 (5자) */
  MIN: 5,
  /** 게시글 내용 최대 길이 (1,000,000자) */
  MAX: 1_000_000,
} as const;

/**
 * 댓글 내용의 길이 제한을 정의하는 상수
 */
export const COMMENT_LEN = {
  /** 댓글 내용 최소 길이 (5자) */
  MIN: 5,
  /** 댓글 내용 최대 길이 (10,000자) */
  MAX: 10_000,
} as const;

/**
 * 게시글 관련 알림의 내용 길이 제한을 정의하는 상수
 */
export const NOTIFY_POST_CONTENT_LEN = 15;

/**
 * 댓글 관련 알림의 내용 길이 제한을 정의하는 상수
 */
export const NOTIFY_COMMENT_CONTENT_LEN = 15;
