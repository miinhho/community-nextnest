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
}
