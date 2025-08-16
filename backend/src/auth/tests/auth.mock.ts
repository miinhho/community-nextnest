import { AuthService } from '@/auth/auth.service';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { UserService } from '@/user/user.service';
import { MockFactory } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { MockMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

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

export const authMockFactory: MockFactory = (token) => {
  if (token === UserService) {
    return {
      findUserByEmail: jest.fn().mockResolvedValue({ ...MockData.user }),
      createUser: jest.fn().mockResolvedValue({ ...MockData.user }),
    };
  }
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
  if (token === RefreshTokenService) {
    return {
      createRefreshToken: jest.fn(),
      findRefreshTokenByToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
    };
  }
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(token) as MockMetadata<any, any>;
    const Mock = moduleMocker.generateFromMetadata(mockMetadata) as ObjectConstructor;
    return new Mock();
  }
};
