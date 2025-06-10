import { User } from '@/common/decorator/user.decorator';
import { FollowStatus } from '@/common/status/follow-status';
import { UserData } from '@/common/user';
import {
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FollowService } from './follow.service';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post(':targetId')
  async followUser(
    @User() user: UserData,
    @Param('targetId') targetId: string,
    @Res() res: Response,
  ) {
    const status = await this.followService.followUser(user.id, targetId);

    switch (status) {
      case FollowStatus.FOLLOW_SUCCESS:
        return res.json({
          success: true,
          message: '팔로우 성공',
          data: { targetId },
        });
      case FollowStatus.UNFOLLOW_SUCCESS:
        return res.json({
          success: true,
          message: '언팔로우 성공',
          data: { targetId },
        });
      case FollowStatus.FOLLOW_FAIL:
        throw new InternalServerErrorException('팔로우 실패');
      case FollowStatus.UNFOLLOW_FAIL:
        throw new InternalServerErrorException('언팔로우 실패');
    }
  }
}
