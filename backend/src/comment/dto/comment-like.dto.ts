import { LikeStatus } from '@/common/status';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleCommentLikeResponseDto {
  @ApiProperty({
    enum: [LikeStatus.PLUS, LikeStatus.MINUS],
    description: '댓글 좋아요 상태',
  })
  status: LikeStatus;

  @ApiProperty({
    description: '좋아요/싫어요를 토글한 댓글의 ID',
  })
  commentId: string;
}
