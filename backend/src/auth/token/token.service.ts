import { JwtPayload } from '@/auth/token/token.types';
import jwt from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(jwt.KEY)
    private jwtConfig: ConfigType<typeof jwt>,
    private userService: UserService,
  ) {}

  async generateAccessToken(userId: string) {
    const user = await this.userService.findUserById(userId);
    return this.jwtService.sign(
      {
        sub: userId,
        role: user?.role,
      } as JwtPayload,
      {
        secret: this.jwtConfig.accessSecret,
        expiresIn: this.jwtConfig.accessExpiration,
      },
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpiration,
      },
    );
  }

  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.jwtConfig.accessSecret,
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.jwtConfig.refreshSecret,
    });
  }
}
