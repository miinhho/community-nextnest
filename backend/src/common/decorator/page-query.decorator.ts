import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 페이지네이션 쿼리 인터페이스
 *
 * @interface PageQuery
 * @property {number} page - 현재 페이지 번호 (1부터 시작)
 * @property {number} size - 페이지당 항목 수
 */
export interface PageQuery {
  page: number;
  size: number;
}

/**
 * 쿼리 에서 page와 size 값을 추출하여 PageQuery 객체로 변환하는 데코레이터
 *
 * - page 파라미터가 없거나 유효하지 않으면 기본값 1을 사용하고,
 * - size 파라미터가 없거나 유효하지 않으면 기본값 10을 사용합니다.
 *
 * @example
 * ```
 * ＠Get()
 * findAll(＠PageQuery() pageQuery: PageQuery) {
 *   const { page, size } = pageQuery;
 *   return this.service.findAll(page, size);
 * }
 * ```
 *
 * @example
 * ```
 * // GET /posts?page=2&size=20
 * // pageQuery = { page: 2, size: 20 }
 *
 * // GET /posts
 * // pageQuery = { page: 1, size: 10 } (기본값)
 * ```
 */
export const PageQuery = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PageQuery => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const size = parseInt(request.query.size, 10) || 10;

    return { page, size };
  },
);
