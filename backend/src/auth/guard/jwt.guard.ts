import { OPTIONAL_AUTH_KEY } from '@/common/decorator/optional-auth.decorator';
import { IS_PUBLIC_KEY } from '@/common/decorator/public.decorator';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 기반 인증을 처리하는 Guard 클래스
 *
 * `＠Public` 데코레이터가 적용된 엔드포인트는 인증을 건너뛰고,
 * 그렇지 않은 경우 JWT 토큰을 검증하여 사용자 인증을 수행합니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * 요청에 대한 접근 권한을 확인합니다.
   *
   * `＠Public` 데코레이터가 적용된 경우 인증을 건너뛰고,
   * 그렇지 않은 경우 JWT 토큰 검증을 수행합니다.
   *
   * @param {ExecutionContext} context - NestJS 실행 컨텍스트
   * @returns 접근 허용 여부 또는 부모 클래스의 canActivate 결과
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(OPTIONAL_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    if (isOptionalAuth) {
      try {
        return super.canActivate(context);
      } catch {
        return true;
      }
    }

    return super.canActivate(context);
  }

  /**
   * JWT 인증 결과를 처리합니다.
   *
   * @param err - 인증 과정에서 발생한 에러
   * @param user - 인증된 사용자 정보
   * @returns 인증된 사용자 객체
   * @throws {UnauthorizedException} 인증 실패 또는 사용자 정보가 없는 경우
   */
  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(OPTIONAL_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isOptionalAuth && !user) {
      return null;
    }

    if (err || !user) {
      throw err || new UnauthorizedException('로그인이 필요합니다.');
    }

    return user;
  }
}
