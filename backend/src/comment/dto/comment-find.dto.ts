import {
  CommentWithAuthorDto,
  CommentWithPostDto,
  PageMetaResponseDto,
} from '@/common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommentResponseDto extends CommentWithAuthorDto {
  @ApiProperty({
    description: '게시글 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    type: CommentWithAuthorDto,
    description: '부모 댓글 정보 (대댓글인 경우에만 존재)',
    nullable: true,
  })
  parent: CommentWithAuthorDto | null;
}

export class GetCommentsByPostIdResponseDto {
  @ApiProperty({
    description: '게시물 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    description: '댓글 목록',
    type: [CommentWithAuthorDto],
    isArray: true,
  })
  comments: CommentWithAuthorDto[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}

export class GetCommentsByUserIdResponseDto {
  @ApiProperty({
    description: '댓글 목록',
    type: [CommentWithPostDto],
    isArray: true,
  })
  comments: CommentWithPostDto[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}
