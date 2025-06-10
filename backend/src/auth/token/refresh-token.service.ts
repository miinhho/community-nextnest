import { PrismaService } from '@/common/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(private prismaService: PrismaService) {}

  async createRefreshToken(userId: string, token: string, expiresIn: number) {
    try {
      const refreshToken = await this.prismaService.refreshToken.create({
        data: {
          userId,
          token,
          expiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      });
      return refreshToken;
    } catch {
      throw new InternalServerErrorException('토큰 생성에 실패했습니다');
    }
  }

  async revokeRefreshToken(tokenId: string) {
    try {
      await this.prismaService.refreshToken.delete({
        where: { id: tokenId },
      });
    } catch {
      throw new InternalServerErrorException('토큰 삭제에 실패했습니다');
    }
  }

  async revokeAllUserRefreshTokens(userId: string) {
    try {
      await this.prismaService.refreshToken.deleteMany({
        where: { userId },
      });
    } catch {
      throw new InternalServerErrorException('사용자의 모든 토큰 삭제에 실패했습니다');
    }
  }

  async findRefreshTokenById(tokenId: string) {
    try {
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { id: tokenId },
      });
      return refreshToken!;
    } catch {
      throw new InternalServerErrorException('토큰을 찾는 데 실패했습니다');
    }
  }

  async findRefreshTokenByToken(token: string) {
    try {
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { token },
      });
      return refreshToken!;
    } catch {
      throw new InternalServerErrorException('토큰을 찾는 데 실패했습니다');
    }
  }
}
