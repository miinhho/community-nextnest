import { AuthService } from '@/auth/auth.service';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { allMock } from '@/common/mocks/mock';
import { pipeFn } from '@/common/utils/fn';
import { UserService } from '@/user/user.service';
import { MockFactory } from '@nestjs/testing';
import { Role } from '@prisma/client';

export const MockData = {
  user: {
    id: 'example-id',
    name: 'Example User',
    emailVerified: null,
    password: 'hashed-password1!!',
    image: null,
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  token: {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  },
  newToken: {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  },
};

const userServiceMock: MockFactory = (token) => {
  if (token === UserService) {
    return {
      findUserByEmail: jest.fn().mockResolvedValue({ ...MockData.user }),
      createUser: jest.fn().mockResolvedValue({ ...MockData.user }),
    };
  }
};

const authServiceMock: MockFactory = (token) => {
  if (token === AuthService) {
    return {
      validateUser: jest.fn().mockResolvedValue({
        id: MockData.user.id,
        role: MockData.user.role,
      }),
      hashPassword: jest.fn().mockImplementation((password) => password),
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };
  }
};

const tokenServiceMock: MockFactory = (token) => {
  if (token === TokenService) {
    return {
      generateAccessToken: jest.fn().mockResolvedValue(MockData.token.accessToken),
      generateRefreshToken: jest.fn().mockReturnValue(MockData.token.refreshToken),
      refreshTokens: jest.fn().mockResolvedValue({
        accessToken: MockData.newToken.accessToken,
        refreshToken: MockData.newToken.refreshToken,
      }),
      verifyRefreshToken: jest.fn(),
    };
  }
};

const refreshTokenServiceMock: MockFactory = (token) => {
  if (token === RefreshTokenService) {
    return {
      createRefreshToken: jest.fn(),
      findRefreshTokenByToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
    };
  }
};

export const authMockFactory: MockFactory = pipeFn(
  userServiceMock,
  authServiceMock,
  tokenServiceMock,
  refreshTokenServiceMock,
  allMock,
);
