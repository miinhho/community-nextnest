import { AuthService } from '@/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

/**
 * 사용자가 제공한 이메일과 비밀번호를 검증하여 인증을 수행합니다.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * 사용자 자격 증명을 검증합니다.
   *
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @returns 검증된 사용자 정보
   * @throws {UnauthorizedException} 잘못된 자격 증명인 경우
   */
  async validate(email: string, password: string): Promise<any> {
    return this.authService.validateUser(email, password);
  }
}
