import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class NotifyResponseDto {
  @ApiProperty({
    description: '알람 ID',
  })
  id: string;

  @ApiProperty({
    description: '알람 타입',
    enum: [
      NotificationType.COMMENT_LIKE,
      NotificationType.COMMENT_REPLY,
      NotificationType.FOLLOW,
      NotificationType.MESSAGE,
      NotificationType.POST_COMMENT,
      NotificationType.POST_LIKE,
      NotificationType.SYSTEM,
    ],
  })
  type: NotificationType;

  @ApiProperty({
    description: '알람 이미지',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: '알람 제목',
  })
  title: string;

  @ApiProperty({
    description: '알람 내용',
    nullable: true,
  })
  content: string | null;

  @ApiProperty({
    description: '알람 읽음 여부',
  })
  isRead: boolean;

  @ApiProperty({
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '알람 관련 사용자',
    type: 'object',
    properties: {
      id: { type: 'string', description: '사용자 ID' },
      name: { type: 'string', description: '사용자 이름' },
    },
  })
  user: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: '게시글 ID',
    nullable: true,
  })
  postId?: string | null;

  @ApiProperty({
    description: '댓글 ID',
    nullable: true,
  })
  commentId?: string | null;

  @ApiProperty({
    description: '팔로워 정보',
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'string', description: '팔로워 ID' },
      name: { type: 'string', description: '팔로워 이름' },
    },
  })
  follower?: {
    id: string;
    name: string;
  } | null;
}
