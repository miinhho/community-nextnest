import { IsContent } from '@/common/decorator/content.decorator';
import { COMMENT_LEN } from '@/common/utils/content';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID(4, {
    message: '유효하지 않은 게시글 ID입니다.',
  })
  @ApiProperty({
    type: String,
    description: '댓글이 달릴 게시글의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  postId: string;

  @IsContent(COMMENT_LEN.MIN, COMMENT_LEN.MAX)
  content: string;
}

export class UpdateCommentDto {
  @IsUUID(4, {
    message: '유효하지 않은 댓글 ID입니다.',
  })
  @ApiProperty({
    type: String,
    description: '수정할 댓글의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  commentId: string;

  @IsContent(COMMENT_LEN.MIN, COMMENT_LEN.MAX)
  content: string;
}
