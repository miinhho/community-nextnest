import { IsContent } from '@/common/decorator/content.decorator';
import { IsIdUUID } from '@/common/decorator/uuid.decorator';
import { COMMENT_LEN } from '@/common/utils/content';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsIdUUID({ description: '댓글이 달릴 게시글의 ID' })
  postId: string;

  @IsContent(COMMENT_LEN.MIN, COMMENT_LEN.MAX)
  content: string;
}

export class CreateCommentResponseDto {
  @ApiProperty({
    type: String,
    description: '생성된 댓글의 ID (UUID)',
  })
  commentId: string;

  @ApiProperty({
    type: String,
    description: '댓글이 달린 게시글의 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    type: String,
    description: '댓글 작성자의 ID (UUID)',
  })
  authorId: string;
}
