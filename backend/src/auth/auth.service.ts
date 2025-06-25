import { RegisterUserDto } from '@/auth/dto/register.dto';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { UserData } from '@/common/user';
import jwt from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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

  /**
   * 사용자의 이메일과 비밀번호를 검증합니다.
   *
   * LocalStrategy에서 사용되며, 로그인 시 사용자 자격 증명을 확인합니다.
   *
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호 (평문)
   * @returns 검증된 사용자 정보
   * @throws {NotFoundException} 사용자를 찾을 수 없는 경우
   * @throws {UnauthorizedException} 비밀번호가 일치하지 않는 경우
   * @throws {InternalServerErrorException} 인증 과정에서 오류 발생 시
   */
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email, true);
      await this.comparePassword(password, user.password);

      return {
        id: user.id,
        role: user.role,
      } as UserData;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof UnauthorizedException) {
        throw err;
      }
      this.logger.error('사용자 인증 실패', err.stack, {
        email,
        passwordLength: password.length,
      });
      throw new InternalServerErrorException('사용자 인증에 실패했습니다');
    }
  }

  /**
   * 사용자 로그인을 처리하고 토큰을 발급합니다.
   *
   * @param user - 인증된 사용자 정보
   * @returns 로그인 결과 (Access Token, Refresh Token, 사용자 정보)
   * @throws {InternalServerErrorException} 토큰 생성 실패 시
   */
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

  /**
   * 새 사용자를 등록하고 로그인을 처리합니다.
   *
   * @param userDto - 회원가입 정보 (이메일, 비밀번호, 이름)
   * @returns 회원가입 및 로그인 결과 (Access Token, Refresh Token, 사용자 정보)
   * @throws {BadRequestException} 이미 사용 중인 이메일인 경우
   * @throws {InternalServerErrorException} 사용자 생성 또는 로그인 실패 시
   */
  async register(userDto: RegisterUserDto) {
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

  /**
   * Refresh Token을 사용하여 새로운 토큰들을 발급합니다.
   *
   * 기존 Refresh Token을 무효화하고 새로운 Access Token과 Refresh Token을 생성합니다.
   *
   * @param refreshToken - 기존 Refresh Token
   * @returns 새로운 토큰 쌍 (Access Token, Refresh Token)
   * @throws {UnauthorizedException} 토큰이 유효하지 않거나 만료된 경우
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   */
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
      throw new UnauthorizedException('토큰 갱신에 실패했습니다');
    }
  }

  /**
   * 사용자 로그아웃을 처리합니다.
   *
   * 제공된 Refresh Token을 데이터베이스에서 삭제하여 무효화합니다.
   *
   * @param refreshToken - 무효화할 Refresh Token
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 토큰 삭제 실패 시
   */
  async logout(refreshToken: string) {
    const token = await this.refreshTokenService.findRefreshTokenByToken(refreshToken);
    if (token) {
      await this.refreshTokenService.revokeRefreshToken(token.id);
    }
  }

  /**
   * 평문 비밀번호를 해시화합니다.
   *
   * bcrypt를 사용하여 SALT_ROUND(12) 라운드로 해시화를 수행합니다.
   *
   * @param plain - 평문 비밀번호
   * @returns 해시화된 비밀번호
   * @private
   */
  private async hashPassword(plain: string) {
    const salt = await genSalt(SALT_ROUND);
    return hash(plain, salt);
  }

  /**
   * 평문 비밀번호와 해시화된 비밀번호를 비교합니다.
   *
   * @param plain - 평문 비밀번호
   * @param hashed - 해시화된 비밀번호
   * @throws {UnauthorizedException} 비밀번호가 일치하지 않는 경우
   * @private
   */
  private async comparePassword(plain: string, hashed: string) {
    const isValid = await compare(plain, hashed);
    if (!isValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
  }
}
