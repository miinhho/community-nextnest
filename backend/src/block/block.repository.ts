import { PrismaErrorHandler } from '@/prisma/prisma-error-handler.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BlockRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 사용자가 다른 사용자를 차단했는지 확인합니다.
   * @param props.userId - 차단 여부를 확인할 사용자 ID
   * @param props.targetId - 차단된 사용자의 ID
   * @returns 특정 사용자와 다른 사용자의 차단 관계
   * - `userBlocked`: 내가 차단했는지 여부
   * - `targetBlocked`: 상대방이 나를 차단했는지 여부
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {InternalServerErrorException} 차단 여부 확인 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '존재하지 않는 사용자입니다.',
    Default: '차단 여부 확인 실패',
  })
  async isUserBlocked({ userId, targetId }: { userId: string; targetId: string }) {
    const [userInfo, targetInfo] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          blocked: {
            where: { id: targetId },
            select: { id: true },
          },
          id: true,
        },
      }),
      this.prisma.user.findUniqueOrThrow({
        where: { id: targetId },
        select: {
          blocked: {
            where: { id: userId },
            select: { id: true },
          },
          id: true,
        },
      }),
    ]);

    return {
      userBlocked: userInfo.blocked !== null,
      targetBlocked: targetInfo.blocked !== null,
    };
  }

  /**
   * 두 사용자가 한 명이라도 차단했는지 확인합니다.
   * @param props.userId - 첫 번째 사용자 ID
   * @param props.otherUserId - 두 번째 사용자 ID
   * @returns 두 사용자가 서로 차단했는지 여부 (true: 차단됨, false: 차단되지 않음)
   * @throws {InternalServerErrorException} 차단 여부 확인 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '차단 여부 확인 실패',
  })
  async eachUserBlocked({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }) {
    const block = await this.prisma.blocking.findFirst({
      where: {
        OR: [
          {
            blockerId: userId,
            blockedId: otherUserId,
          },
          {
            blockerId: otherUserId,
            blockedId: userId,
          },
        ],
      },
      select: { id: true },
    });
    return !(block === null);
  }

  /**
   * 다른 사용자를 차단합니다.
   * @param props.userId - 차단하는 사용자 ID
   * @param props.targetId - 차단되는 사용자 ID
   * @throws {ConflictException} 이미 차단된 사용자인 경우
   * @throws {InternalServerErrorException} 차단 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '사용자 차단 실패',
    UniqueConstraintViolation: '이미 차단된 사용자입니다.',
  })
  async blockUser({ userId, targetId }: { userId: string; targetId: string }) {
    await this.prisma.blocking.create({
      data: {
        blockerId: userId,
        blockedId: targetId,
      },
    });

    // 차단 시 관계 정리
    await this.cleanUpRelation({
      userId,
      targetId,
    });
  }

  /**
   * 사용자가 차단한 사용자의 차단을 해제합니다.
   * @param props.userId - 차단 해제하는 사용자 ID
   * @param props.targetId - 차단 해제되는 사용자 ID
   * @throws {NotFoundException} 차단되지 않은 사용자인 경우
   * @throws {InternalServerErrorException} 차단 해제 중 오류 발생 시
   */
  @PrismaErrorHandler({
    RecordsNotFound: '차단되지 않은 사용자입니다.',
    Default: '사용자 차단 실패',
  })
  async unblockUser({ userId, targetId }: { userId: string; targetId: string }) {
    await this.prisma.blocking.delete({
      where: {
        blockerId_blockedId: {
          blockerId: userId,
          blockedId: targetId,
        },
      },
      select: {},
    });
  }

  /**
   * 사용자가 차단한 사용자 목록을 조회합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {InternalServerErrorException} 차단 목록 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '차단 목록 조회 실패',
  })
  async getBlockedUsers(userId: string) {
    return this.prisma.blocking.findMany({
      where: { blockerId: userId },
      select: {
        blocked: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  /**
   * 사용자를 차단한 사용자의 목록을 조회합니다.
   * @param userId - 차단된 사용자 ID
   * @throws {InternalServerErrorException} 차단된 사용자 목록 조회 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '사용자를 차단한 사용자 목록 조회 실패',
  })
  async getBlockedByUsers(userId: string) {
    return this.prisma.blocking.findMany({
      where: { blockedId: userId },
      select: {
        blocker: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * 유저 관계를 정리합니다.
   * @param userId - 차단을 요청한 사용자 ID
   * @param targetId - 차단 대상 사용자 ID
   * @throws {InternalServerErrorException} 차단 관계 정리 중 오류 발생 시
   */
  @PrismaErrorHandler({
    Default: '차단 관계 정리 실패',
  })
  private async cleanUpRelation({
    userId,
    targetId,
  }: {
    userId: string;
    targetId: string;
  }) {
    await this.prisma.follow.deleteMany({
      where: {
        OR: [
          {
            followerId: userId,
            followingId: targetId,
          },
          {
            followerId: targetId,
            followingId: userId,
          },
        ],
      },
    });
  }
}
