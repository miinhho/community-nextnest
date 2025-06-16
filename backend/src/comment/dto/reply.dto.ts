import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ReplyContentDto {
  @IsString()
  @IsUUID(4, {
    message: '유효하지 않은 게시글 ID입니다.',
  })
  @ApiProperty({
    type: String,
    description: '답글이 달릴 게시글의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  postId: string;

  @IsString()
  @IsUUID(4, {
    message: '유효하지 않은 댓글 ID입니다.',
  })
  @ApiProperty({
    type: String,
    description: '답글이 달릴 댓글의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  commentId: string;

  @IsString()
  @MinLength(5, {
    message: '5글자 이상의 내용을 적어주세요.',
  })
  @MaxLength(1_000_000, {
    message: '최대 글자 수에 도달했습니다.',
  })
  @ApiProperty({
    type: String,
    description: '답글 내용',
    maxLength: 1_000_000,
    minLength: 5,
  })
  content: string;
}
