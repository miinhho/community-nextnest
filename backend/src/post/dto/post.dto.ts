import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class PostContentDto {
  @MinLength(5, {
    message: '5글자 이상의 내용을 적어주세요.',
  })
  @MaxLength(1_000_000, {
    message: '최대 글자 수에 도달했습니다.',
  })
  @ApiProperty({
    type: String,
    description: '게시글 내용',
    maxLength: 1_000_000,
    minLength: 5,
  })
  content: string;
}
