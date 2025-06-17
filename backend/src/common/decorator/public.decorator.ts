import { SetMetadata } from '@nestjs/common';

/**
 * 공개 엔드포인트 메타데이터 키
 *
 * @constant {string} IS_PUBLIC_KEY - 공개 엔드포인트임을 나타내는 메타데이터 키
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 공개 엔드포인트 데코레이터
 *
 * 인증이 필요하지 않은 공개 엔드포인트임을 표시하는 데코레이터입니다.
 * AuthGuard에서 이 메타데이터를 확인하여 인증을 건너뛸 수 있습니다.
 *
 * @returns 공개 엔드포인트 메타데이터를 설정하는 데코레이터
 *
 * @example
 * ```
 * ＠Public()
 * ＠Get('public-posts')
 * getPublicPosts() {
 *   return this.service.findPublicPosts();
 * }
 * ```
 *
 * @example
 * ```
 * ＠Public()
 * ＠Post('register')
 * register(＠Body() registerDto: RegisterDto) {
 *   return this.authService.register(registerDto);
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
