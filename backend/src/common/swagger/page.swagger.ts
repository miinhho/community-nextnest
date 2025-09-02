import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

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
      name: 'size',
      required: false,
      description: '페이지당 수 (기본값: 10)',
      type: 'integer',
      example: 10,
    }),
  );
