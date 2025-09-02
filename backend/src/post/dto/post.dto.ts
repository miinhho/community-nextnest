import { IsContent } from '@/common/decorator/content.decorator';
import {
  PageMetaResponseDto,
  PostResponseDto,
  UserPrivateResponseDto,
  UserResponseDto,
} from '@/common/dto/response.dto';
import { LikeStatus } from '@/common/status';
import { CONTENT_LEN } from '@/common/utils/content';
import { ApiProperty } from '@nestjs/swagger';

export class PostContentDto {
  @IsContent(CONTENT_LEN.MIN, CONTENT_LEN.MAX)
  content: string;
}

export class PostDetail extends PostResponseDto {
  @ApiProperty({
    description: '댓글 수',
  })
  commentCount: number;

  @ApiProperty({
    description: '게시글 작성자 정보',
    type: UserResponseDto,
  })
  author: UserResponseDto;
}

export class CreatePostResponseDto {
  @ApiProperty({
    type: String,
    description: '생성한 게시물의 ID (UUID)',
  })
  postId: string;

  @ApiProperty({
    type: String,
    description: '글쓴이의 ID (UUID)',
  })
  authorId: string;
}

export class FindPostsResponseDto {
  @ApiProperty({
    description: '게시글 목록',
    type: [PostDetail],
    isArray: true,
  })
  posts: PostDetail[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}

export class FindPostByIdResponseDto extends PostResponseDto {
  @ApiProperty({
    description: '댓글 수',
  })
  commentCount: number;

  @ApiProperty({
    description: '게시글 작성자 정보',
    type: UserPrivateResponseDto,
  })
  author: UserPrivateResponseDto;
}

export class UpdatePostResponseDto {
  @ApiProperty({
    description: '수정된 게시물의 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    description: '수정된 게시물 글쓴이의 ID (UUID)',
  })
  authorId: string;
}

export class DeletePostResponseDto {
  @ApiProperty({
    description: '삭제된 게시물의 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    description: '삭제된 게시물 글쓴이의 ID (UUID)',
  })
  authorId: string;

  @ApiProperty({
    type: String,
    description: '삭제된 게시물의 내용',
  })
  content: string;
}

export class ToggleLikeResponseDto {
  @ApiProperty({
    description: '게시물 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    enum: [LikeStatus.PLUS, LikeStatus.MINUS],
    description: '게시물 좋아요 상태',
  })
  status: LikeStatus;
}

export class GetUserPostsResponseDto {
  @ApiProperty({
    description: '사용자 게시글 목록',
    type: [PostDetail],
    isArray: true,
  })
  posts: PostDetail[];

  @ApiProperty({
    description: '페이지네이션 정보',
    type: PageMetaResponseDto,
  })
  meta: PageMetaResponseDto;
}
