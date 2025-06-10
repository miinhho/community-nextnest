import { IdParam } from '@/common/decorator/id.decorator';
import { User } from '@/common/decorator/user.decorator';
import { FollowStatus } from '@/common/status/follow-status';
import { UserData } from '@/common/user';
import { Controller, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post(':id')
  async followUser(@IdParam() targetId: string, @User() user: UserData) {
    const status = await this.followService.followUser(user.id, targetId);

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
}
