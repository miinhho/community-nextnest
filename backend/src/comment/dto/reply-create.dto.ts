import { IsContent } from '@/common/decorator/content.decorator';
import { IsIdUUID } from '@/common/decorator/uuid.decorator';
import { COMMENT_LEN } from '@/common/utils/content';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @IsIdUUID({ description: '답글이 달릴 게시글의 ID' })
  postId: string;

  @IsIdUUID({ description: '답글이 달릴 댓글의 ID' })
  commentId: string;

  @IsContent(COMMENT_LEN.MIN, COMMENT_LEN.MAX)
  content: string;
}

export class CreateReplyResponseDto {
  @ApiProperty({
    description: '생성된 답글의 ID (UUID)',
  })
  replyId: string;

  @ApiProperty({
    description: '답글이 달린 게시글의 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    description: '답글 작성자의 ID (UUID)',
  })
  authorId: string;
}
