import { InternalServerErrorException } from '@nestjs/common';

/**
 * 페이지네이션 쿼리 인터페이스
 *
 * @property {number} page - 현재 페이지 번호 (0부터 시작)
 * @property {number} size - 페이지당 항목 수
 */
export interface PageQueryType {
  page: number;
  size: number;
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
  meta: PageQueryType;
}

/**
 * 페이지네이션의 초기값을 정의하는 상수 객체
 *
 * 기본 페이지는 0, 페이지 크기는 10으로 설정
 */
export const INITIAL_PAGE: PageQueryType = {
  page: 0,
  size: 10,
};

/**
 * 데이터와 페이지네이션 정보를 받아 PageData 형태로 변환합니다.
 *
 * @template T - 데이터의 타입
 * @param params.data - 실제 데이터
 * @param params.totalCount - 전체 항목 수
 * @param params.page - 현재 페이지 번호 (기본값: 0)
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
export const toPageData = <T>(
  {
    data,
    page,
    size,
  }: {
    data: T;
  } & PageQueryType = {
    ...INITIAL_PAGE,
    data: null as any,
  },
): PageData<T> => {
  if (data === null || data === undefined) {
    // 데이터가 null 또는 undefined인 경우 개발자가 데이터를 잘못 처리한 경우로 간주
    // 이 경우에는 InternalServerErrorException을 던져 개발자가 문제를 인지할 수 있도록 합니다.
    throw new InternalServerErrorException(
      '정상적인 데이터를 받지 못했습니다. 관리자에게 문의해주세요.',
    );
  }

  return {
    data,
    meta: {
      page,
      size,
    },
  };
};
