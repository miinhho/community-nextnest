import { FollowStatus } from '@/common/status';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleFollowResponseDto {
  @ApiProperty({
    description: '팔로우 대상 사용자 ID',
  })
  targetId: string;

  @ApiProperty({
    description: '팔로우 상태',
    enum: [FollowStatus.FOLLOW, FollowStatus.UNFOLLOW],
  })
  status: FollowStatus;
}
