import { SetMetadata } from '@nestjs/common';

/**
 * 선택적 인증 메타데이터 키
 */
export const OPTIONAL_AUTH_KEY = Symbol('optionalAuth');

/**
 * 선택적 인증 데코레이터
 *
 * 이 데코레이터가 적용된 엔드포인트는 인증이 없더라도 접근할 수 있습니다.
 *
 * @example
 * ```
 * ＠Get('optional-endpoint')
 * ＠OptionalAuth()
 * getOptionalEndpoint() {
 *   return this.service.getOptionalData();
 * }
 * ```
 */
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
