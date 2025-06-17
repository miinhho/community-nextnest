import { JwtPayload } from '@/auth/token/token.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT 토큰을 검증하는 Passport 전략 클래스
 *
 * Authorization 헤더의 Bearer 토큰 또는 쿠키의 access_token에서 JWT를 추출하고 검증합니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          return req.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret')!,
    });
  }

  /**
   * JWT 페이로드를 검증하고 사용자 정보를 반환합니다.
   *
   * @param payload - JWT에서 추출된 페이로드
   * @returns 사용자 정보 객체 (id, role)
   *
   * @example
   * ```
   * // JWT 페이로드: { sub: "user123", role: "USER" }
   * // 반환값: { id: "user123", role: "USER" }
   * ```
   */
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
