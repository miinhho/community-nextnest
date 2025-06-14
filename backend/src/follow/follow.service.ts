import { FollowStatus } from '@/common/status/follow-status';
import { AlreadyFollowError } from '@/follow/error/already-follow.error';
import { FollowRepository } from '@/follow/follow.repository';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userService: UserService,
  ) {}

  async followUser(userId: string, targetId: string, toggle: boolean = true) {
    try {
      await this.userService.validateUserExists(targetId);
      await this.followRepository.followUser(userId, targetId);
      return FollowStatus.FOLLOW;
    } catch (err) {
      if (toggle && err instanceof AlreadyFollowError) {
        return this.unfollowUser(userId, targetId);
      }
      throw err;
    }
  }

  async unfollowUser(userId: string, targetId: string) {
    await this.followRepository.unfollowUser(userId, targetId);
    return FollowStatus.UNFOLLOW;
  }

  async isFollowing(userId: string, targetId: string) {
    await this.userService.validateUserExists(targetId);
    return this.followRepository.isFollowing(userId, targetId);
  }

  async getFollowersCount(userId: string) {
    await this.userService.validateUserExists(userId);
    return this.followRepository.getFollowersCount(userId);
  }

  async getFollowingCount(userId: string) {
    await this.userService.validateUserExists(userId);
    return this.followRepository.getFollowingCount(userId);
  }

  async getFollowers(userId: string, page: number = 1, size: number = 10) {
    await this.userService.validateUserExists(userId);
    return this.followRepository.getFollowers(userId, page, size);
  }

  async getFollowing(userId: string, page: number = 1, size: number = 10) {
    await this.userService.validateUserExists(userId);
    return this.followRepository.getFollowing(userId, page, size);
  }
}
