import { PageParams } from '@/types/page.types'

/**
 * 페이지네이션의 초기값을 정의하는 상수 객체
 * 기본 페이지는 0, 페이지 크기는 10으로 설정
 */
export const INITIAL_PAGE: PageParams = {
  page: 0,
  size: 10,
} as const
