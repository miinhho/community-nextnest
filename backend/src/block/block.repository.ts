import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class BlockRepository {
  private readonly logger = new Logger(BlockRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 사용자가 다른 사용자를 차단했는지 확인합니다.
   * @param props.userId - 차단 여부를 확인할 사용자 ID
   * @param props.targetId - 차단된 사용자의 ID
   * @returns 특정 사용자와 다른 사용자의 차단 관계
   * - `userBlocked`: 내가 차단했는지 여부
   * - `targetBlocked`: 상대방이 나를 차단했는지 여부
   * @throws {NotFoundException} 존재하지 않는 사용자인 경우
   * @throws {PrismaDBError} 차단 여부 확인 중 오류 발생 시
   */
  async isUserBlocked({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      const [userInfo, targetInfo] = await this.prisma.$transaction([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            blocked: {
              where: { id: targetId },
              select: { id: true },
            },
            id: true,
          },
        }),
        this.prisma.user.findUnique({
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

      if (userInfo === null || targetInfo === null) {
        throw new NotFoundException('존재하지 않는 사용자입니다.');
      }

      return {
        userBlocked: userInfo.blocked !== null,
        targetBlocked: targetInfo.blocked !== null,
      };
    } catch (err) {
      this.logger.error('차단 여부 확인 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('차단 여부 확인 실패', err.code);
    }
  }

  /**
   * 두 사용자가 한 명이라도 차단했는지 확인합니다.
   * @param props.userId - 첫 번째 사용자 ID
   * @param props.otherUserId - 두 번째 사용자 ID
   * @returns 두 사용자가 서로 차단했는지 여부 (true: 차단됨, false: 차단되지 않음)
   * @throws {PrismaDBError} 차단 여부 확인 중 오류 발생 시
   */
  async eachUserBlocked({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }) {
    try {
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
    } catch (err) {
      this.logger.error('차단 여부 확인 중 오류 발생', err.stack, {
        userId,
        otherUserId,
      });
      throw new PrismaDBError('차단 여부 확인 실패', err.code);
    }
  }

  /**
   * 다른 사용자를 차단합니다.
   * @param props.userId - 차단하는 사용자 ID
   * @param props.targetId - 차단되는 사용자 ID
   * @throws {BadRequestException} 이미 차단된 사용자인 경우
   * @throws {PrismaDBError} 차단 중 오류 발생 시
   */
  async blockUser({ userId, targetId }: { userId: string; targetId: string }) {
    try {
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
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new BadRequestException('이미 차단된 사용자입니다.');
      }
      this.logger.error('사용자 차단 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('사용자 차단 실패', err.code);
    }
  }

  /**
   * 사용자가 차단한 사용자의 차단을 해제합니다.
   * @param props.userId - 차단 해제하는 사용자 ID
   * @param props.targetId - 차단 해제되는 사용자 ID
   * @throws {NotFoundException} 차단되지 않은 사용자인 경우
   * @throws {PrismaDBError} 차단 해제 중 오류 발생 시
   */
  async unblockUser({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.blocking.delete({
        where: {
          blockerId_blockedId: {
            blockerId: userId,
            blockedId: targetId,
          },
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new NotFoundException('차단되지 않은 사용자입니다.');
      }
      this.logger.error('사용자 차단 해제 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('사용자 차단 해제 실패', err.code);
    }
  }

  /**
   * 사용자가 차단한 사용자 목록을 조회합니다.
   * @param userId - 차단한 사용자 ID
   * @throws {PrismaDBError} 차단 목록 조회 중 오류 발생 시
   */
  async getBlockedUsers(userId: string) {
    try {
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
    } catch (err) {
      this.logger.error('차단 목록 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('차단 목록 조회 실패', err.code);
    }
  }

  /**
   * 사용자를 차단한 사용자의 목록을 조회합니다.
   * @param userId - 차단된 사용자 ID
   * @throws {PrismaDBError} 차단된 사용자 목록 조회 중 오류 발생 시
   */
  async getBlockedByUsers(userId: string) {
    try {
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
    } catch (err) {
      this.logger.error('사용자를 차단한 사용자 목록 조회 중 오류 발생', err.stack, {
        userId,
      });
      throw new PrismaDBError('사용자를 차단한 사용자 목록 조회 실패', err.code);
    }
  }

  /**
   * 유저 관계를 정리합니다.
   * @param userId - 차단을 요청한 사용자 ID
   * @param targetId - 차단 대상 사용자 ID
   * @throws {PrismaDBError} 차단 관계 정리 중 오류 발생 시
   */
  private async cleanUpRelation({
    userId,
    targetId,
  }: {
    userId: string;
    targetId: string;
  }) {
    try {
      await this.prisma.$transaction([
        this.prisma.follow.deleteMany({
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
        }),
      ]);
    } catch (err) {
      this.logger.error('차단 관계 정리 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('차단 관계 정리 실패', err.code);
    }
  }
}
