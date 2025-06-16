import { AuthService } from '@/auth/auth.service';
import { UserRegisterDto } from '@/auth/dto/register.dto';
import { LocalAuthGuard } from '@/auth/guard/local.guard';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { UserData } from '@/common/user';
import app from '@/config/app.config';
import jwt from '@/config/jwt.config';
import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly COOKIE_OPTIONS: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    @Inject(jwt.KEY)
    private readonly jwtConfig: ConfigType<typeof jwt>,
    @Inject(app.KEY)
    private readonly appConfig: ConfigType<typeof app>,
  ) {
    this.COOKIE_OPTIONS = {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'strict',
      maxAge: this.jwtConfig.refreshExpiration,
      path: '/',
    };
  }

  @Public()
  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserData, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(user);
    this.setRefreshTokenCookie(res, result.refreshToken);

    const { refreshToken: _, ...responseData } = result;
    return responseData;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.extractRefreshToken(req);
    const tokens = await this.authService.refreshTokens(refreshToken);

    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    return { success: true };
  }

  private extractRefreshToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다');
    }
    return refreshToken;
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, this.COOKIE_OPTIONS);
  }
}
