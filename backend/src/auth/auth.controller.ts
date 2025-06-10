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
import { Request, Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(jwt.KEY)
    private jwtConfig: ConfigType<typeof jwt>,
    @Inject(app.KEY)
    private appConfig: ConfigType<typeof app>,
  ) {}

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

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'strict',
      maxAge: this.jwtConfig.refreshExpiration,
      path: '/',
    });

    const { refreshToken: _, ...responseData } = result;
    return responseData;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'strict',
      maxAge: this.jwtConfig.refreshExpiration,
      path: '/',
    });

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
}
