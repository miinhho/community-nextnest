import { userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { AlreadyFollowRequestError } from '@/follow/error/already-follow-request.error';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { PrismaDBError } from '@/prisma/error/prisma-db.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class FollowRepository {
  private readonly logger = new Logger(FollowRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자를 팔로우합니다.
   * @param params.userId - 팔로우를 요청하는 사용자 ID
   * @param params.targetId - 팔로우할 대상 사용자 ID
   * @throws {AlreadyFollowError} 이미 팔로우한 사용자인 경우
   * @throws {PrismaDBError} 팔로우 실패 시
   */
  async followUser({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetId,
        },
      });
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyFollowError(userId, targetId);
      }
      this.logger.error('팔로우 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('팔로우 실패', err.code);
    }
  }

  /**
   * 사용자 팔로우를 취소합니다.
   * @param params.userId - 언팔로우를 요청하는 사용자 ID
   * @param params.targetId - 언팔로우할 대상 사용자 ID
   * @throws {PrismaDBError} 존재하지 않는 사용자이거나 언팔로우 실패 시
   */
  async unfollowUser({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
        select: {},
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new PrismaDBError('존재하지 않는 사용자입니다.', err.code);
      }

      this.logger.error('언팔로우 중 오류 발생', err.stack, {
        followerId: userId,
        followingId: targetId,
      });
      throw new PrismaDBError('언팔로우 실패', err.code);
    }
  }

  async isFollowRequested({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      const followRequest = await this.prisma.followRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: targetId,
          },
        },
        select: {},
      });
      return !!followRequest;
    } catch (err) {
      this.logger.error('팔로우 요청 상태 확인 중 오류 발생', err.stack, {
        senderId: userId,
        receiverId: targetId,
      });
      throw new PrismaDBError('팔로우 요청 상태 확인 실패', err.code);
    }
  }

  /**
   * 사용자가 팔로우 요청을 보낸 사용자들의 목록을 조회합니다.
   * @param userId - 팔로우 요청을 보낸 사용자 ID
   * @throws {PrismaDBError} 팔로우 요청 조회 실패 시
   */
  findFollowRequestSent(userId: string) {
    try {
      return this.prisma.followRequest.findMany({
        where: { senderId: userId },
        select: {
          sender: {
            select: userSelections,
          },
        },
      });
    } catch (err) {
      this.logger.error('팔로우 요청 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('팔로우 요청 조회 실패', err.code);
    }
  }

  /**
   * 사용자가 팔로우 요청을 받은 사용자들의 목록을 조회합니다.
   * @param userId - 팔로우 요청을 받은 사용자 ID
   * @throws {PrismaDBError} 팔로우 요청 조회 실패 시
   */
  findFollowRequestReceived(userId: string) {
    try {
      return this.prisma.followRequest.findMany({
        where: { receiverId: userId },
        select: {
          receiver: {
            select: userSelections,
          },
        },
      });
    } catch (err) {
      this.logger.error('팔로우 요청 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('팔로우 요청 조회 실패', err.code);
    }
  }

  /**
   * 팔로우 요청을 생성합니다.
   * @param params.userId - 팔로우 요청을 보낸 사용자 ID
   * @param params.targetId - 팔로우 요청을 받은 대상 사용자 ID
   * @throws {AlreadyFollowRequestError} 이미 팔로우 요청이 존재하는 경우
   * @throws {PrismaDBError} 팔로우 요청 실패 시
   */
  async createFollowRequest({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.followRequest.create({
        data: {
          senderId: userId,
          receiverId: targetId,
        },
      });
    } catch (err) {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw new AlreadyFollowRequestError(userId, targetId);
      }
      this.logger.error('팔로우 요청 중 오류 발생', err.stack, {
        userId,
        targetId,
      });
      throw new PrismaDBError('팔로우 요청 실패', err.code);
    }
  }

  /**
   * 팔로우 요청을 삭제합니다.
   * @param params.userId - 팔로우 요청을 보낸 사용자 ID
   * @param params.targetId - 팔로우 요청을 받은 대상 사용자 ID
   * @throws {PrismaDBError} 팔로우 요청 취소 실패 시
   */
  async deleteFollowRequest({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      await this.prisma.followRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: targetId,
          },
        },
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new PrismaDBError('존재하지 않는 팔로우 요청입니다.', err.code);
      }
      this.logger.error('팔로우 요청 취소 중 오류 발생', err.stack, {
        senderId: userId,
        receiverId: targetId,
      });
      throw new PrismaDBError('팔로우 요청 취소 실패', err.code);
    }
  }

  /**
   * 두 사용자 간의 팔로우 관계를 확인합니다.
   * @param params.userId - 팔로우를 요청한 사용자 ID
   * @param params.targetId - 팔로우 대상 사용자 ID
   * @returns 팔로우 여부 (true: 팔로우 중, false: 팔로우하지 않음)
   * @throws {PrismaDBError} 팔로우 상태 확인 실패 시
   */
  async isFollowing({ userId, targetId }: { userId: string; targetId: string }) {
    try {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
        select: {},
      });
      return !!follow;
    } catch (err) {
      this.logger.error('팔로우 상태 확인 중 오류 발생', err.stack, {
        followerId: userId,
        followingId: targetId,
      });
      throw new PrismaDBError('팔로우 상태 확인 실패', err.code);
    }
  }

  /**
   * 특정 사용자의 팔로워 수를 조회합니다.
   * @param userId - 팔로워 수를 조회할 사용자 ID
   * @throws {PrismaDBError} 팔로워 수 조회 실패 시
   */
  async getFollowersCount(userId: string) {
    try {
      return this.prisma.follow.count({
        where: { followingId: userId },
      });
    } catch (err) {
      this.logger.error('팔로워 수 조회 중 오류 발생', err.stack, {
        followingId: userId,
      });
      throw new PrismaDBError('팔로워 수 조회 실패', err.code);
    }
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 수를 조회합니다.
   * @param userId - 팔로잉 수를 조회할 사용자 ID
   * @throws {PrismaDBError} 팔로잉 수 조회 실패 시
   */
  async getFollowingCount(userId: string) {
    try {
      return this.prisma.follow.count({
        where: { followerId: userId },
      });
    } catch (err) {
      this.logger.error('팔로잉 수 조회 중 오류 발생', err.stack, {
        followerId: userId,
      });
      throw new PrismaDBError('팔로잉 수 조회 실패', err.code);
    }
  }

  /**
   * 특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로워 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {PrismaDBError} 팔로워 목록 조회 실패 시
   */
  async getFollowers(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [followers, totalCount] = await this.prisma.$transaction([
        this.prisma.follow.findMany({
          where: { followingId: userId },
          select: {
            follower: {
              select: userSelections,
            },
          },
          skip: (page - 1) * size,
          take: size,
        }),
        this.prisma.follow.count({ where: { followingId: userId } }),
      ]);

      return toPageData<typeof followers>({
        data: followers,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('팔로워 목록 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('팔로워 목록 조회 실패', err.code);
    }
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로잉 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @throws {PrismaDBError} 팔로잉 목록 조회 실패 시
   */
  async getFollowing(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [following, totalCount] = await this.prisma.$transaction([
        this.prisma.follow.findMany({
          where: { followerId: userId },
          select: {
            following: {
              select: userSelections,
            },
          },
          skip: (page - 1) * size,
          take: size,
        }),
        this.prisma.follow.count({ where: { followerId: userId } }),
      ]);

      return toPageData<typeof following>({
        data: following,
        totalCount,
        page,
        size,
      });
    } catch (err) {
      this.logger.error('팔로잉 목록 조회 중 오류 발생', err.stack, { userId });
      throw new PrismaDBError('팔로잉 목록 조회 실패', err.code);
    }
  }
}
