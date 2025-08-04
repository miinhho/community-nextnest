import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { FollowStatus } from '@/common/status';
import { UserData } from '@/common/user';
import {
  ApiGetUserFollowers,
  ApiGetUserFollowersCount,
  ApiGetUserFollowing,
  ApiGetUserFollowingCount,
  ApiRejectFollowRequest,
  ApiSendFollowRequest,
  ApiToggleFollowUser,
} from '@/follow/follow.swagger';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FollowService } from './follow.service';
import { PageQueryType } from '@/common/utils/page';

@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('user/:id/follow')
  @ApiToggleFollowUser()
  async toggleFollowUser(@IdParam() targetId: string, @User() user: UserData) {
    const status = await this.followService.followUser({
      userId: user.id,
      targetId,
    });

    switch (status) {
      case FollowStatus.FOLLOW:
        return {
          success: true,
          data: { targetId, status: FollowStatus.FOLLOW },
        };
      case FollowStatus.UNFOLLOW:
        return {
          success: true,
          data: { targetId, status: FollowStatus.UNFOLLOW },
        };
    }
  }

  @Post('user/:id/follow/request')
  @ApiSendFollowRequest()
  async sendFollowRequest(@IdParam('id') targetId: string, @User() user: UserData) {
    await this.followService.sendFollowRequest({
      userId: user.id,
      targetId,
    });

    return {
      success: true,
      data: { targetId },
    };
  }

  @Delete('user/:id/follow/request')
  @ApiRejectFollowRequest()
  async rejectFollowRequest(@IdParam('id') targetId: string, @User() user: UserData) {
    await this.followService.rejectFollowRequest({
      userId: user.id,
      targetId,
    });

    return {
      success: true,
      data: { targetId },
    };
  }

  @Public()
  @Get('user/:id/following-count')
  @ApiGetUserFollowingCount()
  async getUserFollowingCount(@IdParam() id: string) {
    const followingCount = await this.followService.getFollowingCount(id);
    return {
      success: true,
      data: { followingCount },
    };
  }

  @Public()
  @Get('user/:id/followers-count')
  @ApiGetUserFollowersCount()
  async getUserFollowersCount(@IdParam() id: string) {
    const followersCount = await this.followService.getFollowersCount(id);
    return {
      success: true,
      data: { followersCount },
    };
  }

  @Public()
  @Get('user/:id/followers')
  @ApiGetUserFollowers()
  async getUserFollowers(@IdParam() id: string, @PageQuery() pageQuery: PageQueryType) {
    const { data: followers, meta } = await this.followService.getFollowers(
      id,
      pageQuery,
    );
    return {
      success: true,
      data: {
        followers,
        meta,
      },
    };
  }

  @Public()
  @Get('user/:id/following')
  @ApiGetUserFollowing()
  async getUserFollowing(@IdParam() id: string, @PageQuery() pageQuery: PageQueryType) {
    const { data: following, meta } = await this.followService.getFollowing(
      id,
      pageQuery,
    );
    return {
      success: true,
      data: {
        following,
        meta,
      },
    };
  }
}
