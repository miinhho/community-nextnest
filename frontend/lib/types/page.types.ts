export interface PageParams {
  page?: number
  size?: number
}

export interface PageMeta {
  totalCount: number
  pageCount: number
  currentPage: number
  pageSize: number
}
