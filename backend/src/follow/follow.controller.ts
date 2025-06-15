import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { FollowStatus } from '@/common/status/follow-status';
import { UserData } from '@/common/user';
import { Controller, Get, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('api')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow/:id')
  async followUser(@IdParam() targetId: string, @User() user: UserData) {
    const status = await this.followService.followUser({
      userId: user.id,
      targetId,
    });

    switch (status) {
      case FollowStatus.FOLLOW:
        return {
          success: true,
          message: '팔로우 성공',
          data: { targetId, status: FollowStatus.FOLLOW },
        };
      case FollowStatus.UNFOLLOW:
        return {
          success: true,
          message: '언팔로우 성공',
          data: { targetId, status: FollowStatus.UNFOLLOW },
        };
    }
  }

  @Public()
  @Get('user/:id/following-count')
  async getUserFollowingCount(@IdParam() id: string) {
    const followingCount = await this.followService.getFollowingCount(id);
    return {
      success: true,
      data: { followingCount },
    };
  }

  @Public()
  @Get('user/:id/followers-count')
  async getUserFollowersCount(@IdParam() id: string) {
    const followersCount = await this.followService.getFollowersCount(id);
    return {
      success: true,
      data: { followersCount },
    };
  }

  @Public()
  @Get('user/:id/followers')
  async getUserFollowers(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
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
  async getUserFollowing(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
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
