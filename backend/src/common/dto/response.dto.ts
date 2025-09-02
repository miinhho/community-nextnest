import { ApiProperty } from '@nestjs/swagger';

export class TimestampResponseDto {
  @ApiProperty({
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
  })
  updatedAt: Date;
}

export class PageMetaResponseDto {
  @ApiProperty({
    description: '현재 페이지',
  })
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
  })
  size: number;
}

export class UserResponseDto {
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: '유저 프로필 이미지 URL',
    nullable: true,
  })
  image: string | null;
}

export class UserPrivateResponseDto extends UserResponseDto {
  @ApiProperty({
    description: '유저 비공개 여부',
  })
  isPrivate: boolean;
}

export class CommentResponseDto extends TimestampResponseDto {
  @ApiProperty({
    description: '댓글 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    description: '댓글 내용',
  })
  content: string;

  @ApiProperty({
    description: '댓글 좋아요 수',
  })
  likesCount: number;
}

export class CommentWithAuthorDto extends CommentResponseDto {
  @ApiProperty({
    description: '댓글 작성자 정보',
    type: UserResponseDto,
  })
  author: UserResponseDto;
}

export class PostResponseDto extends TimestampResponseDto {
  @ApiProperty({
    description: '게시글 ID (UUID)',
  })
  id: string;

  @ApiProperty({
    description: '게시글 내용',
  })
  content: string;

  @ApiProperty({
    description: '게시글 좋아요 수',
  })
  likeCount: number;
}

export class CommentWithPostDto extends CommentResponseDto {
  @ApiProperty({
    type: PostResponseDto,
  })
  post: PostResponseDto;
}
