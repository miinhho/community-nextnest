import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * 페이지네이션 메타데이터의 Swagger 스키마 정의
 *
 * API 응답에서 페이지네이션 정보를 문서화할 때 사용됩니다.
 */
export const pageMetaSchema = {
  type: 'object',
  properties: {
    totalCount: { type: 'number', description: '전체 항목 수' },
    pageCount: { type: 'number', description: '전체 페이지 수' },
    currentPage: { type: 'number', description: '현재 페이지' },
    pageSize: { type: 'number', description: '페이지당 항목 수' },
  },
  required: ['totalCount', 'pageCount', 'currentPage', 'pageSize'],
};

/**
 * 페이지네이션 쿼리 파라미터를 위한 Swagger 데코레이터
 *
 * 컨트롤러 메서드에 적용하여 페이지네이션 관련 쿼리 파라미터를 문서화합니다.
 *
 * @returns 조합된 데코레이터
 *
 * @example
 * ```typescript
 * ＠ApiPageQuery()
 * ＠Get()
 * async getPosts(＠Query() pageQuery: PageQueryType) {
 *   // 페이지네이션 파라미터가 Swagger에 문서화됨
 * }
 * ```
 */
export const ApiPageQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      type: 'integer',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 수 (기본값: 10)',
      type: 'integer',
      example: 10,
    }),
  );
