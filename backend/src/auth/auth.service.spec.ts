/* eslint-disable @typescript-eslint/unbound-method */
import { AuthService } from '@/auth/auth.service';
import { RegisterUserDto } from '@/auth/dto/register.dto';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import appConfig from '@/config/app.config';
import jwtConfig from '@/config/jwt.config';
import { UserService } from '@/user/user.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let tokenService: TokenService;
  let refreshTokenService: RefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test.local',
          load: [jwtConfig, appConfig],
          isGlobal: true,
        }),
      ],
      providers: [AuthService, UserService, TokenService, RefreshTokenService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('모듈이 제대로 생성되어 서비스가 정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  it('login: 유저의 데이터를 반환해야 합니다', async () => {
    const accessToken = 'mock-access-token';
    const refreshToken = 'mock-refresh-token';
    const userData = {
      id: 'mock-id',
      role: Role.USER,
    };
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValue(accessToken);
    jest.spyOn(tokenService, 'generateRefreshToken').mockReturnValue(refreshToken);
    jest.spyOn(tokenService, 'generateAccessToken');
    jest.spyOn(tokenService, 'generateRefreshToken');
    jest.spyOn(refreshTokenService, 'createRefreshToken');

    const expected = {
      user: userData,
      accessToken,
      refreshToken,
    };
    const result = await service.login(userData);

    // 응답이 예상대로 반환되는지 확인
    expect(result).toEqual(expected);

    // 토큰 생성 메소드가 올바른 인자로 호출되었는지 확인
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(userData.id);
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(userData.id);
    expect(refreshTokenService.createRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('register: 새로운 유저를 생성해야 합니다', async () => {
    const hashedPassword = 'hashedPassword';
    jest.spyOn(service as any, 'hashPassword').mockResolvedValue(hashedPassword);
    jest.spyOn(userService, 'createUser');

    const registerUserDto: RegisterUserDto = {
      name: 'Mock User',
      email: 'mock@email.com',
      password: 'password1!!',
    };

    await service.register(registerUserDto);

    // 유저 생성 메소드가 올바른 인자로 호출되었는지 확인
    expect(userService.createUser).toHaveBeenCalledWith({
      email: registerUserDto.email,
      password: hashedPassword,
      name: registerUserDto.name,
    });
  });

  it('logout: 유저의 Refresh Token을 삭제해야 합니다', async () => {
    const tokenId = 'mock-token-id';
    jest
      .spyOn(refreshTokenService, 'findRefreshTokenByToken')
      .mockResolvedValue({ id: tokenId } as any);
    jest.spyOn(refreshTokenService, 'revokeRefreshToken');

    await service.logout('mock-refresh-token');

    expect(refreshTokenService.findRefreshTokenByToken).toHaveBeenCalled();
    expect(refreshTokenService.revokeRefreshToken).toHaveBeenCalledWith(tokenId);
  });
});
