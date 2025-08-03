import { PrismaErrorHandler } from '@/prisma/prisma-error.interceptor';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 Refresh Token을 데이터베이스에 저장합니다.
   *
   * @param userId - 토큰 소유자 사용자 ID
   * @param token - Refresh Token 문자열
   * @param expiresIn - 토큰 만료 시간 (초)
   * @throws {InternalServerErrorException} 토큰 생성 실패 시
   */
  @PrismaErrorHandler({
    Default: '토큰 생성에 실패했습니다.',
  })
  async createRefreshToken(userId: string, token: string, expiresIn: number) {
    return this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });
  }

  /**
   * 특정 Refresh Token을 데이터베이스에서 삭제합니다.
   *
   * @param tokenId - 삭제할 토큰의 ID
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 토큰 삭제 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 토큰이 존재하지 않습니다.',
    Default: '토큰 삭제 중 오류 발생',
  })
  async revokeRefreshToken(tokenId: string) {
    await this.prisma.refreshToken.delete({
      where: { id: tokenId },
      select: {},
    });
  }

  /**
   * 특정 사용자의 모든 Refresh Token을 데이터베이스에서 삭제합니다.
   *
   * @param userId - 토큰을 삭제할 사용자 ID
   * @throws {NotFoundException} 사용자의 토큰을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 토큰 삭제 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 사용자의 토큰이 존재하지 않습니다.',
    Default: '사용자의 모든 토큰 삭제에 실패했습니다.',
  })
  async revokeAllUserRefreshTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * 토큰 ID로 Refresh Token을 조회합니다.
   *
   * @param tokenId - 조회할 토큰의 ID
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 토큰 조회 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 토큰이 존재하지 않습니다',
    Default: '토큰 조회 중 오류 발생',
  })
  async findRefreshTokenById(tokenId: string) {
    return this.prisma.refreshToken.findUniqueOrThrow({
      where: { id: tokenId },
    });
  }

  /**
   * 토큰 문자열로 Refresh Token을 조회합니다.
   *
   * @param token - 조회할 Refresh Token 문자열
   * @returns Refresh Token 레코드
   * @throws {NotFoundException} 토큰을 찾을 수 없는 경우
   * @throws {InternalServerErrorException} 토큰 조회 실패 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '해당 토큰이 존재하지 않습니다.',
    Default: '토큰 조회 중 오류 발생',
  })
  async findRefreshTokenByToken(token: string) {
    return this.prisma.refreshToken.findUniqueOrThrow({
      where: { token },
    });
  }
}
