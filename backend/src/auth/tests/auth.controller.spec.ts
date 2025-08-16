import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { RegisterUserDto } from '@/auth/dto/register.dto';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@/auth/strategy/local.strategy';
import { authMockFactory, MockData } from '@/auth/tests/auth.mock';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { UserData } from '@/common/user';
import appConfig from '@/config/app.config';
import jwtConfig from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
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
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        TokenService,
        RefreshTokenService,
        UserService,
      ],
      controllers: [AuthController],
    })
      .useMocker(authMockFactory)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('모듈이 제대로 생성되어 컨트롤러가 정의되어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  it('register: 쿠키를 설정하고 유저의 데이터를 반환해야 합니다', async () => {
    const returnPayload = {
      accessToken: MockData.token.accessToken,
      refreshToken: MockData.token.refreshToken,
      user: {
        id: MockData.user.id,
        role: MockData.user.role,
      },
    };
    const registerUserDto: RegisterUserDto = {
      name: MockData.user.name,
      email: 'mock@email.com',
      password: MockData.user.password,
    };
    const res = { cookie: jest.fn() } as any;
    jest.spyOn(service, 'register').mockResolvedValue(returnPayload);

    const result = await controller.register(registerUserDto, res);

    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual({
      success: true,
      data: {
        id: MockData.user.id,
        role: MockData.user.role,
      },
    });

    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      MockData.token.refreshToken,
      (controller as any).REFRESH_COOKIE_OPTIONS,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'accessToken',
      MockData.token.accessToken,
      (controller as any).ACCESS_COOKIE_OPTIONS,
    );
  });

  it('login: 쿠키를 설정하고 유저의 데이터를 반환해야 합니다', async () => {
    const serviceReturn = {
      accessToken: MockData.token.accessToken,
      refreshToken: MockData.token.refreshToken,
      user: {
        id: MockData.user.id,
        role: MockData.user.role,
      },
    };
    const res = { cookie: jest.fn() } as any;
    const userData: UserData = { id: MockData.user.id, role: MockData.user.role };
    jest.spyOn(service, 'login').mockResolvedValue(serviceReturn);

    const result = await controller.login(userData, res);

    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual({
      success: true,
      data: { id: MockData.user.id, role: MockData.user.role },
    });
    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  it('logout: refresh token 이 있다면 service 의 logout 을 호출하고 쿠키를 삭제해야 합니다', async () => {
    const req = { cookies: { refreshToken: MockData.token.refreshToken } } as unknown as Request;
    const res = { clearCookie: jest.fn() } as any;
    const spy = jest.spyOn(service, 'logout').mockResolvedValue(undefined);

    const result = await controller.logout(req, res);

    // service 의 logout 메소드가 호출되는지 확인
    expect(spy).toHaveBeenCalledWith(MockData.token.refreshToken);
    // 쿠키가 삭제되는지 확인
    expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual({ success: true });
  });

  it('logout: refresh token 이 없다면 쿠키를 삭제해야 합니다', async () => {
    const req = { cookies: {} } as unknown as Request;
    const res = { clearCookie: jest.fn() } as any;
    const spy = jest.spyOn(service, 'logout');

    const result = await controller.logout(req, res);

    // service 의 logout 메소드가 호출되지 않았는지 확인
    expect(spy).not.toHaveBeenCalled();
    // 쿠키가 삭제되는지 확인
    expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual({ success: true });
  });

  it('refresh: refresh token 이 있다면 새로운 토큰을 반환해야 합니다', async () => {
    const req = { cookies: { refreshToken: MockData.token.refreshToken } } as unknown as Request;
    const res = { cookie: jest.fn() } as any;
    jest.spyOn(service, 'refreshTokens').mockResolvedValue({
      accessToken: MockData.newToken.accessToken,
      refreshToken: MockData.newToken.refreshToken,
    });

    const result = await controller.refresh(req, res);

    // 쿠키가 설정되는지 확인
    expect(res.cookie).toHaveBeenCalledTimes(2);
    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual({ success: true });
  });

  it('refresh: refresh token 이 없다면 NotFoundException 을 던져야 합니다', async () => {
    const req = { cookies: {} } as unknown as Request;
    const res = { cookie: jest.fn() } as unknown as Response;

    await expect(controller.refresh(req, res)).rejects.toBeInstanceOf(NotFoundException);
  });
});
