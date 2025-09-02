import { IsContent } from '@/common/decorator/content.decorator';
import { COMMENT_LEN } from '@/common/utils/content';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID(4, {
    message: '유효하지 않은 댓글 ID입니다.',
  })
  @ApiProperty({
    type: String,
    description: '수정할 댓글의 ID (UUID)',
  })
  commentId: string;

  @IsContent(COMMENT_LEN.MIN, COMMENT_LEN.MAX)
  content: string;
}
