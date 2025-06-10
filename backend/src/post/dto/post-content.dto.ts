import { MaxLength, MinLength } from 'class-validator';

export class PostContentDto {
  @MinLength(5, {
    message: '5글자 이상의 내용을 적어주세요.',
  })
  @MaxLength(1_000_000, {
    message: '최대 글자 수에 도달했습니다.',
  })
  content: string;
}
