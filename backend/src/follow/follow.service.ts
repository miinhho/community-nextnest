import { PrismaService } from '@/common/database/prisma.service';
import { FollowStatus } from '@/common/status/follow-status';
import { Injectable } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async followUser(
    userId: string,
    targetId: string,
    toggle: boolean = true,
  ): Promise<FollowStatus> {
    try {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetId,
        },
      });
      return FollowStatus.FOLLOW_SUCCESS;
    } catch (err: any) {
      if (toggle && err.code === PrismaError.UniqueConstraintViolation) {
        return this.unfollowUser(userId, targetId);
      }
      return FollowStatus.FOLLOW_FAIL;
    }
  }

  async unfollowUser(userId: string, targetId: string): Promise<FollowStatus> {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
      });
      return FollowStatus.UNFOLLOW_SUCCESS;
    } catch {
      return FollowStatus.UNFOLLOW_FAIL;
    }
  }
}
