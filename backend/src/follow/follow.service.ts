import { FollowStatus } from '@/common/status/follow-status';
import { PageParams } from '@/common/utils/page';
import { ValidateService } from '@/common/validate/validate.service';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { FollowRepository } from '@/follow/follow.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly validateService: ValidateService,
  ) {}

  async followUser({
    userId,
    targetId,
    toggle = true,
  }: {
    userId: string;
    targetId: string;
    toggle?: boolean;
  }) {
    try {
      await this.validateService.validateUserExists(targetId);
      await this.followRepository.followUser({
        userId,
        targetId,
      });
      return FollowStatus.FOLLOW;
    } catch (err) {
      if (toggle && err instanceof AlreadyFollowError) {
        return this.unfollowUser({
          userId,
          targetId,
        });
      }
      throw err;
    }
  }

  async unfollowUser(props: { userId: string; targetId: string }) {
    await this.followRepository.unfollowUser(props);
    return FollowStatus.UNFOLLOW;
  }

  async isFollowing({ userId, targetId }: { userId: string; targetId: string }) {
    await this.validateService.validateUserExists(targetId);
    return this.followRepository.isFollowing({
      userId,
      targetId,
    });
  }

  async getFollowersCount(userId: string) {
    await this.validateService.validateUserExists(userId);
    return this.followRepository.getFollowersCount(userId);
  }

  async getFollowingCount(userId: string) {
    await this.validateService.validateUserExists(userId);
    return this.followRepository.getFollowingCount(userId);
  }

  async getFollowers(userId: string, pageParams: PageParams) {
    await this.validateService.validateUserExists(userId);
    return this.followRepository.getFollowers(userId, pageParams);
  }

  async getFollowing(userId: string, pageParams: PageParams) {
    await this.validateService.validateUserExists(userId);
    return this.followRepository.getFollowing(userId, pageParams);
  }
}
