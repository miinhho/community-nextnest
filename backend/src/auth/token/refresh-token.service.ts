import { PrismaService } from '@/common/database/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

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
    } catch (err) {
      this.logger.error('토큰 생성 중 오류 발생', err.stack, {
        userId,
        tokenLength: token.length,
        expiresIn,
      });

      throw new InternalServerErrorException('토큰 생성에 실패했습니다');
    }
  }

  async revokeRefreshToken(tokenId: string) {
    try {
      await this.prismaService.refreshToken.delete({
        where: { id: tokenId },
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 토큰이 존재하지 않습니다');
      }

      this.logger.error('토큰 삭제 중 오류 발생', err.stack, {
        tokenId,
      });
      throw new InternalServerErrorException('토큰 삭제에 실패했습니다');
    }
  }

  async revokeAllUserRefreshTokens(userId: string) {
    try {
      await this.prismaService.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 사용자의 토큰이 존재하지 않습니다');
      }

      this.logger.error('사용자의 모든 토큰 삭제 중 오류 발생', err.stack, { userId });
      throw new InternalServerErrorException('사용자의 모든 토큰 삭제에 실패했습니다');
    }
  }

  async findRefreshTokenById(tokenId: string) {
    try {
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { id: tokenId },
      });
      return refreshToken!;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 토큰이 존재하지 않습니다');
      }

      this.logger.error('토큰을 찾는 중 오류 발생', err.stack, { tokenId });
      throw new InternalServerErrorException('토큰을 찾는 데 실패했습니다');
    }
  }

  async findRefreshTokenByToken(token: string) {
    try {
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { token },
      });
      return refreshToken!;
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 토큰이 존재하지 않습니다');
      }

      this.logger.error('토큰을 찾는 중 오류 발생', err.stack, {
        tokenPrefix: token.substring(0, 8) + '...',
      });
      throw new InternalServerErrorException('토큰을 찾는 데 실패했습니다');
    }
  }
}
