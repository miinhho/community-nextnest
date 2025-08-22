import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import appConfig from '@/config/app.config';
import jwtConfig from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import { createMock } from '@golevelup/ts-jest';
import { CacheModule } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const accessTokenKey = 'accessToken';
  const refreshTokenKey = 'refreshToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('jwt.accessSecret'),
            signOptions: { expiresIn: config.get<number>('jwt.accessExpiration') },
          }),
        }),
        CacheModule.register(),
        ConfigModule.forRoot({
          envFilePath: '.env.test.local',
          load: [jwtConfig, appConfig],
          isGlobal: true,
        }),
      ],
      providers: [AuthService, TokenService, RefreshTokenService, UserService],
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('모듈이 제대로 생성되어 컨트롤러가 정의되어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  it('register: 쿠키를 설정해야 합니다', async () => {
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const res = { cookie: jest.fn() } as any;
    jest.spyOn(service, 'register').mockResolvedValue({
      user: {} as any,
      accessToken,
      refreshToken,
    });

    await controller.register({} as any, res);

    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledWith(
      refreshTokenKey,
      refreshToken,
      (controller as any).REFRESH_COOKIE_OPTIONS,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      accessTokenKey,
      accessToken,
      (controller as any).ACCESS_COOKIE_OPTIONS,
    );
  });

  it('login: 쿠키를 설정해야 합니다', async () => {
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const res = { cookie: jest.fn() } as any;
    jest.spyOn(service, 'login').mockResolvedValue({
      user: {} as any,
      accessToken,
      refreshToken,
    });

    await controller.login({} as any, res);

    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledWith(
      refreshTokenKey,
      refreshToken,
      (controller as any).REFRESH_COOKIE_OPTIONS,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      accessTokenKey,
      accessToken,
      (controller as any).ACCESS_COOKIE_OPTIONS,
    );
  });

  it('logout: 쿠키를 삭제해야 합니다', async () => {
    const req = { cookies: { refreshToken: 'refresh-token' } } as unknown as Request;
    const res = { clearCookie: jest.fn() } as any;

    await controller.logout(req, res);

    // 쿠키가 삭제되는지 확인
    expect(res.clearCookie).toHaveBeenCalledWith(accessTokenKey);
    expect(res.clearCookie).toHaveBeenCalledWith(refreshTokenKey);
  });

  it('refresh: refresh token 이 있다면 새로운 토큰을 반환해야 합니다', async () => {
    const refreshToken = {
      old: 'old-refresh-token',
      new: 'new-refresh-token',
    };
    const accessToken = {
      old: 'old-access-token',
      new: 'new-access-token',
    };
    const req = { cookies: { refreshToken: refreshToken.old } } as unknown as Request;
    const res = { cookie: jest.fn() } as any;
    jest.spyOn(service, 'refreshTokens').mockResolvedValue({
      accessToken: accessToken.new,
      refreshToken: refreshToken.new,
    });

    await controller.refresh(req, res);

    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      refreshToken.new,
      (controller as any).REFRESH_COOKIE_OPTIONS,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'accessToken',
      accessToken.new,
      (controller as any).ACCESS_COOKIE_OPTIONS,
    );
  });

  it('refresh: refresh token 이 없다면 NotFoundException 을 던져야 합니다', async () => {
    const req = { cookies: {} } as unknown as Request;
    const res = { cookie: jest.fn() } as unknown as Response;

    await expect(controller.refresh(req, res)).rejects.toBeInstanceOf(NotFoundException);
  });
});
