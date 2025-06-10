import { UserRegisterDto } from '@/auth/dto/register.dto';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { UserData } from '@/common/user.data';
import jwt from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { compareSync, genSalt, hash } from 'bcrypt';

const SALT_ROUND = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwt.KEY)
    private jwtConfig: ConfigType<typeof jwt>,
    private userService: UserService,
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email, true);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async login(user: UserData) {
    const accessToken = this.tokenService.generateAccessToken(user.id);
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
        email: user.email,
      },
    };
  }

  async register(userDto: UserRegisterDto) {
    const existingUser = await this.userService.findUserByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const user = await this.userService.createUser({
      email: userDto.email,
      password: hashedPassword,
      name: userDto.name,
    });

    return this.login({
      id: user.id,
      email: user.email,
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
        throw new UnauthorizedException('Refresh token expired');
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
      throw new UnauthorizedException('Invalid refresh token');
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

  private comparePassword(plain: string, hashed: string) {
    return compareSync(plain, hashed);
  }
}
