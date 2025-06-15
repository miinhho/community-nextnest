import { PrismaService } from '@/common/database/prisma.service';
import { PageParams, toPageData } from '@/common/utils/page';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class FollowRepository {
  private readonly logger = new Logger(FollowRepository.name);

  constructor(private readonly prisma: PrismaService) {}

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

  async getFollowers(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [followers, totalCount] = await this.prisma.$transaction([
        this.prisma.follow.findMany({
          where: { followingId: userId },
          include: { follower: true },
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

  async getFollowing(userId: string, { page = 1, size = 10 }: PageParams) {
    try {
      const [following, totalCount] = await this.prisma.$transaction([
        this.prisma.follow.findMany({
          where: { followerId: userId },
          include: { following: true },
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
