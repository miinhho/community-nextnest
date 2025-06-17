import { userSelections } from '@/common/select';
import { PageParams, toPageData } from '@/common/utils/page';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
   * @throws {InternalServerErrorException} 팔로우 실패 시
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
      throw new InternalServerErrorException('팔로우 실패');
    }
  }

  /**
   * 사용자 팔로우를 취소합니다.
   * @param params.userId - 언팔로우를 요청하는 사용자 ID
   * @param params.targetId - 언팔로우할 대상 사용자 ID
   * @throws {InternalServerErrorException} 존재하지 않는 사용자이거나 언팔로우 실패 시
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
      });
    } catch (err) {
      if (err.code === PrismaError.RecordsNotFound) {
        throw new InternalServerErrorException('존재하지 않는 사용자입니다.');
      }

      this.logger.error('언팔로우 중 오류 발생', err.stack, {
        followerId: userId,
        followingId: targetId,
      });
      throw new InternalServerErrorException('언팔로우 실패');
    }
  }

  /**
   * 두 사용자 간의 팔로우 관계를 확인합니다.
   * @param params.userId - 팔로우를 요청한 사용자 ID
   * @param params.targetId - 팔로우 대상 사용자 ID
   * @returns 팔로우 여부 (true: 팔로우 중, false: 팔로우하지 않음)
   * @throws {InternalServerErrorException} 팔로우 상태 확인 실패 시
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
      });
      return !!follow;
    } catch (err) {
      this.logger.error('팔로우 상태 확인 중 오류 발생', err.stack, {
        followerId: userId,
        followingId: targetId,
      });
      throw new InternalServerErrorException('팔로우 상태 확인 실패');
    }
  }

  /**
   * 특정 사용자의 팔로워 수를 조회합니다.
   * @param userId - 팔로워 수를 조회할 사용자 ID
   * @returns 팔로워 수
   * @throws {InternalServerErrorException} 팔로워 수 조회 실패 시
   */
  async getFollowersCount(userId: string) {
    try {
      return await this.prisma.follow.count({
        where: { followingId: userId },
      });
    } catch (err) {
      this.logger.error('팔로워 수 조회 중 오류 발생', err.stack, {
        followingId: userId,
      });
      throw new InternalServerErrorException('팔로워 수 조회 실패');
    }
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 수를 조회합니다.
   * @param userId - 팔로잉 수를 조회할 사용자 ID
   * @returns 팔로잉 수
   * @throws {InternalServerErrorException} 팔로잉 수 조회 실패 시
   */
  async getFollowingCount(userId: string) {
    try {
      return await this.prisma.follow.count({
        where: { followerId: userId },
      });
    } catch (err) {
      this.logger.error('팔로잉 수 조회 중 오류 발생', err.stack, {
        followerId: userId,
      });
      throw new InternalServerErrorException('팔로잉 수 조회 실패');
    }
  }

  /**
   * 특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로워 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션된 팔로워 목록
   * @throws {InternalServerErrorException} 팔로워 목록 조회 실패 시
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
      throw new InternalServerErrorException('팔로워 목록 조회 실패');
    }
  }

  /**
   * 특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.
   * @param userId - 팔로잉 목록을 조회할 사용자 ID
   * @param params.page - 페이지 번호 (기본값: 1)
   * @param params.size - 페이지 크기 (기본값: 10)
   * @returns 페이지네이션된 팔로잉 목록
   * @throws {InternalServerErrorException} 팔로잉 목록 조회 실패 시
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
      throw new InternalServerErrorException('팔로잉 목록 조회 실패');
    }
  }
}
