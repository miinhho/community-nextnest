import { AuthService } from '@/auth/auth.service';
import { ApiLogin, ApiLogout, ApiRefresh, ApiRegister } from '@/auth/auth.swagger';
import { RegisterUserDto } from '@/auth/dto/register.dto';
import { LocalAuthGuard } from '@/auth/guard/local.guard';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { ApiAuthTags } from '@/common/swagger/tags.swagger';
import { UserData } from '@/common/user';
import app from '@/config/app.config';
import jwt from '@/config/jwt.config';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
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

  @Public()
  @Post('register')
  @ApiRegister()
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.register(registerUserDto);

    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);
    return {
      success: true,
      data: {
        id: user.id,
        role: user.role,
      },
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiLogin()
  async login(@User() user: UserData, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken, user: userData } = await this.authService.login(user);
    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);

    return {
      success: true,
      data: {
        id: userData.id,
        role: userData.role,
      },
    };
  }

  @Post('logout')
  @ApiLogout()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { success: true };
  }

  @CacheTTL(60)
  @UseInterceptors(CacheInterceptor)
  @Post('refresh')
  @ApiRefresh()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = this.extractRefreshToken(req);
    const { refreshToken, accessToken } = await this.authService.refreshTokens(oldRefreshToken);

    this.setRefreshTokenCookie(res, refreshToken);
    this.setAccessTokenCookie(res, accessToken);
    return {
      success: true,
    };
  }

  private extractRefreshToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new NotFoundException('토큰이 존재하지 않습니다');
    }
    return refreshToken;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, this.REFRESH_COOKIE_OPTIONS);
  }

  private setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, this.ACCESS_COOKIE_OPTIONS);
  }
}
