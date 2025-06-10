import { PrismaService } from '@/common/database/prisma.service';
import { FollowStatus } from '@/common/status/follow-status';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async followUser(userId: string, targetId: string, toggle: boolean = true) {
    try {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetId,
        },
      });
      return FollowStatus.FOLLOW;
    } catch (err) {
      if (toggle && err.code === PrismaError.UniqueConstraintViolation) {
        return this.unfollowUser(userId, targetId);
      }
      throw new InternalServerErrorException('팔로우 실패');
    }
  }

  async unfollowUser(userId: string, targetId: string) {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
      });
      return FollowStatus.UNFOLLOW;
    } catch {
      throw new InternalServerErrorException('언팔로우 실패');
    }
  }

  async isFollowing(userId: string, targetId: string) {
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
    } catch {
      throw new InternalServerErrorException('팔로우 상태 확인 실패');
    }
  }

  async getFollowersCount(userId: string) {
    try {
      return await this.prisma.follow.count({
        where: { followingId: userId },
      });
    } catch {
      throw new InternalServerErrorException('팔로워 수 조회 실패');
    }
  }

  async getFollowingCount(userId: string) {
    try {
      return await this.prisma.follow.count({
        where: { followerId: userId },
      });
    } catch {
      throw new InternalServerErrorException('팔로잉 수 조회 실패');
    }
  }

  async getFollowers(userId: string, page: number = 1, size: number = 10) {
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
      return {
        followers,
        totalCount,
        totalPage: Math.ceil(totalCount / size),
      };
    } catch {
      throw new InternalServerErrorException('팔로워 목록 조회 실패');
    }
  }

  async getFollowing(userId: string, page: number = 1, size: number = 10) {
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
      return {
        following,
        totalCount,
        totalPage: Math.ceil(totalCount / size),
      };
    } catch {
      throw new InternalServerErrorException('팔로잉 목록 조회 실패');
    }
  }
}
