import { PageQuery } from '@/common/decorator/page-query.decorator';

/**
 * 페이지네이션 파라미터의 부분 타입
 */
export type PageParams = Partial<PageQuery>;

/**
 * 페이지네이션 메타데이터
 */
export interface PageMeta extends PageQuery {
  /** 전체 페이지 수 */
  totalPage: number;
  /** 전체 항목 수 */
  totalCount: number;
}

/**
 * 페이지네이션된 데이터의 구조
 *
 * @template T - 데이터의 타입
 */
export interface PageData<T> {
  /** 실제 데이터 */
  data: T;
  /** 페이지네이션 메타데이터 */
  meta: PageMeta;
}

/**
 * 데이터와 페이지네이션 정보를 받아 PageData 형태로 변환합니다.
 *
 * @template T - 데이터의 타입
 * @param params.data - 실제 데이터
 * @param params.totalCount - 전체 항목 수
 * @param params.page - 현재 페이지 번호 (기본값: 1)
 * @param params.size - 페이지 크기 (기본값: 10)
 * @returns 페이지네이션된 데이터 객체
 *
 * @example
 * ```typescript
 * const users = await userRepository.findMany();
 * const totalCount = await userRepository.count();
 *
 * const pageData = toPageData({
 *   data: users,
 *   totalCount,
 *   page: 1,
 *   size: 10
 * });
 * // 결과: { data: users, meta: { page: 1, size: 10, totalPage: 5, totalCount: 50 } }
 * ```
 */
export const toPageData = <T>({
  data,
  totalCount,
  page = 1,
  size = 10,
}: {
  data: T;
  totalCount: number;
} & PageParams): PageData<T> => {
  return {
    data,
    meta: {
      page,
      size,
      totalPage: Math.ceil(totalCount / size),
      totalCount,
    },
  };
};
