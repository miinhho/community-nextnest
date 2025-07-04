import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 새로운 Refresh Token을 데이터베이스에 저장합니다.
   *
   * @param userId - 토큰 소유자 사용자 ID
   * @param token - Refresh Token 문자열
   * @param expiresIn - 토큰 만료 시간 (초)
   * @returns 생성된 Refresh Token 레코드
   * @throws {PrismaDBError} 토큰 생성 실패 시
   */
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

      throw new PrismaDBError('토큰 생성에 실패했습니다', err.code);
    }
  }

  /**
   * 특정 Refresh Token을 데이터베이스에서 삭제합니다.
   *
   * @param tokenId - 삭제할 토큰의 ID
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {PrismaDBError} 토큰 삭제 실패 시
   */
  async revokeRefreshToken(tokenId: string) {
    try {
      await this.prismaService.refreshToken.delete({
        where: { id: tokenId },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('해당 토큰이 존재하지 않습니다');
      }

      this.logger.error('토큰 삭제 중 오류 발생', err.stack, {
        tokenId,
      });
      throw new PrismaDBError('토큰 삭제에 실패했습니다', err.code);
    }
  }

  /**
   * 특정 사용자의 모든 Refresh Token을 데이터베이스에서 삭제합니다.
   *
   * @param userId - 토큰을 삭제할 사용자 ID
   * @throws {NotFoundException} 사용자의 토큰을 찾을 수 없는 경우
   * @throws {PrismaDBError} 토큰 삭제 실패 시
   */
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
      throw new PrismaDBError('사용자의 모든 토큰 삭제에 실패했습니다', err.code);
    }
  }

  /**
   * 토큰 ID로 Refresh Token을 조회합니다.
   *
   * @param tokenId - 조회할 토큰의 ID
   * @returns Refresh Token 레코드
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {PrismaDBError} 토큰 조회 실패 시
   */
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
      throw new PrismaDBError('토큰을 찾는 데 실패했습니다', err.code);
    }
  }

  /**
   * 토큰 문자열로 Refresh Token을 조회합니다.
   *
   * @param token - 조회할 Refresh Token 문자열
   * @returns Refresh Token 레코드
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {PrismaDBError} 토큰 조회 실패 시
   */
  async findRefreshTokenByToken(token: string) {
    try {
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { token },
      });
      if (!refreshToken) {
        throw new NotFoundException('해당 토큰이 존재하지 않습니다');
      }
      return refreshToken;
    } catch (err) {
      this.logger.error('토큰을 찾는 중 오류 발생', err.stack, {
        tokenPrefix: token.substring(0, 8) + '...',
      });
      throw new PrismaDBError('토큰을 찾는 데 실패했습니다', err.code);
    }
  }
}
