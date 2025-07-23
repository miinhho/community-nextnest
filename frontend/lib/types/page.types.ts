/**
 * 페이지네이션에 필요한 파라미터를 정의하는 인터페이스
 */
export interface PageParams {
  page?: number
  size?: number
}

/**
 * 페이지 메타데이터를 포함하는 인터페이스
 */
export interface PageMeta {
  totalCount: number
  pageCount: number
  currentPage: number
  pageSize: number
}
