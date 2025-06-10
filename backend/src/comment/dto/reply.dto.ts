import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ReplyContentDto {
  @IsString()
  @IsUUID(4, {
    message: '유효하지 않은 포스트 ID입니다.',
  })
  postId: string;

  @IsString()
  @IsUUID(4, {
    message: '유효하지 않은 댓글 ID입니다.',
  })
  commentId: string;

  @IsString()
  @MinLength(5, {
    message: '5글자 이상의 내용을 적어주세요.',
  })
  @MaxLength(1_000_000, {
    message: '최대 글자 수에 도달했습니다.',
  })
  content: string;
}
