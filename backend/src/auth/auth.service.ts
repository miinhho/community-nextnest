import { UserRegisterDto } from '@/auth/dto/register.dto';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { UserData } from '@/common/user';
import jwt from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';

const SALT_ROUND = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(jwt.KEY)
    private readonly jwtConfig: ConfigType<typeof jwt>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email, true);
      await this.comparePassword(password, user.password);

      return {
        id: user.id,
        role: user.role,
      } as UserData;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      this.logger.error('사용자 인증 실패', err.stack, {
        email,
        passwordLength: password.length,
      });
      throw new InternalServerErrorException('사용자 인증에 실패했습니다');
    }
  }

  async login(user: UserData) {
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    await this.refreshTokenService.createRefreshToken(
      user.id,
      refreshToken,
      this.jwtConfig.refreshExpiration,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
      } as UserData,
    };
  }

  async register(userDto: UserRegisterDto) {
    const existingUser = await this.userService.findUserByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다');
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const user = await this.userService.createUser({
      email: userDto.email,
      password: hashedPassword,
      name: userDto.name,
    });

    return this.login({
      id: user.id,
      role: user.role,
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const userId = payload.sub;

      const storedToken =
        await this.refreshTokenService.findRefreshTokenByToken(refreshToken);

      if (new Date(storedToken.expiresAt) < new Date()) {
        await this.refreshTokenService.revokeRefreshToken(storedToken.id);
        throw new UnauthorizedException('토큰이 만료되었습니다');
      }

      const newAccessToken = this.tokenService.generateAccessToken(userId);
      const newRefreshToken = this.tokenService.generateRefreshToken(userId);

      await this.refreshTokenService.revokeRefreshToken(storedToken.id);

      await this.refreshTokenService.createRefreshToken(
        userId,
        newRefreshToken,
        this.jwtConfig.refreshExpiration,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      this.logger.error('토큰 갱신 실패', err.stack, { refreshToken });
      throw new UnauthorizedException('유효하지 않은 토큰입니다');
    }
  }

  async logout(refreshToken: string) {
    try {
      const token = await this.refreshTokenService.findRefreshTokenByToken(refreshToken);
      if (token) {
        await this.refreshTokenService.revokeRefreshToken(token.id);
      }
      return true;
    } catch {
      return false;
    }
  }

  private async hashPassword(plain: string) {
    const salt = await genSalt(SALT_ROUND);
    return hash(plain, salt);
  }

  private async comparePassword(plain: string, hashed: string) {
    const isValid = await compare(plain, hashed);
    if (!isValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
  }
}
