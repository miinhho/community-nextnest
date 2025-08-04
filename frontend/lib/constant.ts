import { PageParams } from '@/lib/types/page.types'

/**
 * 게시글 내용의 길이 제한을 정의하는 상수 객체
 */
export const CONTENT_LEN = {
  /** 게시글 내용 최소 길이 (5자) */
  MIN: 5,
  /** 게시글 내용 최대 길이 (1,000,000자) */
  MAX: 1_000_000,
} as const

/**
 * 댓글 내용의 길이 제한을 정의하는 상수 객체
 */
export const COMMENT_LEN = {
  /** 댓글 내용 최소 길이 (5자) */
  MIN: 5,
  /** 댓글 내용 최대 길이 (10,000자) */
  MAX: 10_000,
} as const

/**
 * 페이지네이션의 초기값을 정의하는 상수 객체
 * 기본 페이지는 0, 페이지 크기는 10으로 설정
 */
export const INITIAL_PAGE: PageParams = {
  page: 0,
  size: 10,
}
