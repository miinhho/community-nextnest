import { JwtPayload } from '@/auth/token/token.types';
import jwt from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwt.KEY)
    private readonly jwtConfig: ConfigType<typeof jwt>,
    private readonly userService: UserService,
  ) {}

  /**
   * 사용자 ID를 기반으로 Access Token을 생성합니다.
   *
   * @param userId - 토큰을 생성할 사용자 ID
   * @throws {NotFoundException} 사용자를 찾을 수 없는 경우
   * @throws {PrismaDBError} 토큰 생성 실패 시
   */
  async generateAccessToken(userId: string) {
    const role = await this.userService.findUserRoleById(userId);
    return this.jwtService.sign(
      {
        sub: userId,
        role,
      } as JwtPayload,
      {
        secret: this.jwtConfig.accessSecret,
        expiresIn: this.jwtConfig.accessExpiration,
      },
    );
  }

  /**
   * 사용자 ID를 기반으로 Refresh Token을 생성합니다.
   *
   * @param userId - 토큰을 생성할 사용자 ID
   */
  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpiration,
      },
    );
  }

  /**
   * Access Token을 검증하고 페이로드를 반환합니다.
   *
   * @param token - 검증할 Access Token
   * @throws {JsonWebTokenError} 토큰이 유효하지 않은 경우
   * @throws {TokenExpiredError} 토큰이 만료된 경우
   */
  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.jwtConfig.accessSecret,
    });
  }

  /**
   * Refresh Token을 검증하고 페이로드를 반환합니다.
   *
   * @param token - 검증할 Refresh Token
   * @throws {JsonWebTokenError} 토큰이 유효하지 않은 경우
   * @throws {TokenExpiredError} 토큰이 만료된 경우
   */
  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.jwtConfig.refreshSecret,
    });
  }
}
