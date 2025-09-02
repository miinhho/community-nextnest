import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentResponseDto {
  @ApiProperty({
    description: '삭제된 댓글의 내용',
  })
  content: string;

  @ApiProperty({
    description: '댓글이 달린 게시글의 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    description: '댓글 작성자의 ID (UUID)',
  })
  authorId: string;
}
