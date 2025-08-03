import { Param, ParseUUIDPipe } from '@nestjs/common';

/**
 * URL 경로에서 UUID 형식의 ID 파라미터를 추출하고 유효성을 검사하는 데코레이터
 *
 * ParseUUIDPipe를 사용하여 자동으로 UUID 형식 검증을 수행합니다.
 *
 * @param property - 파라미터 이름 (기본값: 'id')
 *
 * @example
 * ```
 * ＠Get(':id')
 * findOne(＠IdParam() id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 *
 * @example
 * ```
 * ＠Get(':userId/posts')
 * findUserPosts(＠IdParam('userId') userId: string) {
 *   return this.service.findUserPosts(userId);
 * }
 * ```
 */
export const IdParam = (property: string = 'id'): ParameterDecorator => {
  return Param(property, ParseUUIDPipe);
};
