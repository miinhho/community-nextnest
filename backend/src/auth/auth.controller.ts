import { AuthService } from '@/auth/auth.service';
import { LoginResponseDto, LoginUserDto } from '@/auth/dto/login.dto';
import { RegisterResponseDto, RegisterUserDto } from '@/auth/dto/register.dto';
import { LocalAuthGuard } from '@/auth/guard/local.guard';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiAuthTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import app from '@/config/app.config';
import jwt from '@/config/jwt.config';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';

@ApiAuthTags()
@Controller('auth')
export class AuthController {
  private readonly REFRESH_COOKIE_OPTIONS: CookieOptions;
  private readonly ACCESS_COOKIE_OPTIONS: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    @Inject(jwt.KEY)
    private readonly jwtConfig: ConfigType<typeof jwt>,
    @Inject(app.KEY)
    private readonly appConfig: ConfigType<typeof app>,
  ) {
    this.REFRESH_COOKIE_OPTIONS = {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'none',
      maxAge: this.jwtConfig.refreshExpiration,
      path: '/',
    };

    this.ACCESS_COOKIE_OPTIONS = {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'none',
      maxAge: this.jwtConfig.accessExpiration,
      path: '/',
    };
  }

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자 계정을 생성합니다.',
  })
  @Post('register')
  @Public()
  @ApiBody({
    description: '회원가입 정보',
    type: RegisterUserDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: '이미 사용 중인 이메일입니다',
  })
  @ApiInternalServerErrorResponse()
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.register(registerUserDto);

    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);

    return {
      id: user.id,
      role: user.role,
    };
  }

  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    description: '로그인 정보',
    type: LoginUserDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiNotFoundResponse({
    description: '잘못된 이메일입니다',
  })
  @ApiUnauthorizedResponse({
    description: '잘못된 비밀번호입니다',
  })
  @ApiInternalServerErrorResponse()
  async login(
    @User() user: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { refreshToken, accessToken, user: userData } = await this.authService.login(user);
    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);

    return {
      id: userData.id,
      role: userData.role,
    };
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @Post('logout')
  @ApiJwtAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '토큰이 존재하지 않습니다' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않습니다' })
  @ApiInternalServerErrorResponse()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Post('refresh')
  @ApiJwtAuth()
  @CacheTTL(60)
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: '토큰이 존재하지 않습니다' })
  @ApiUnauthorizedResponse({ description: '토큰이 유효하지 않습니다' })
  @ApiInternalServerErrorResponse()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const oldRefreshToken = this.extractRefreshToken(req);
    const { refreshToken, accessToken } = await this.authService.refreshTokens(oldRefreshToken);

    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);
  }

  private extractRefreshToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new NotFoundException('토큰이 존재하지 않습니다');
    }
    return refreshToken;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, this.REFRESH_COOKIE_OPTIONS);
  }

  private setAccessTokenCookie(res: Response, accessToken: string): void {
    res.cookie('accessToken', accessToken, this.ACCESS_COOKIE_OPTIONS);
  }
}
