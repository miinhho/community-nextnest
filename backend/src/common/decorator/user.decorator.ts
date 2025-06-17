import { UserData } from '@/common/user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 인증된 사용자 데코레이터
 *
 * HTTP 요청에서 인증된 사용자 정보를 추출하는 데코레이터입니다.
 * JWT 토큰이나 세션을 통해 인증된 사용자의 정보를 컨트롤러 메소드의 파라미터로 주입받을 수 있습니다.
 * AuthGuard와 함께 사용되어야 하며, 인증되지 않은 요청에서는 undefined가 될 수 있습니다.
 *
 * @returns 현재 인증된 사용자의 UserData 객체를 반환하는 파라미터 데코레이터
 *
 * @example
 * ```
 * ＠UseGuards(JwtAuthGuard)
 * ＠Get('profile')
 * getProfile(＠User() user: UserData) {
 *   return this.userService.getProfile(user.id);
 * }
 * ```
 *
 * @example
 * ```
 * ＠UseGuards(JwtAuthGuard)
 * ＠Post()
 * createPost(＠User() user: UserData, ＠Body() createPostDto: CreatePostDto) {
 *   return this.postService.create(user.id, createPostDto);
 * }
 * ```
 */
export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserData;
});
