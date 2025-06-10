import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1, {
    message: '이름을 입력해주세요',
  })
  @MaxLength(15, {
    message: '이름은 15글자를 넘어갈 수 없습니다',
  })
  name?: string;

  // TODO : 나중에 파일 업로드 기능 구현 후 그 기능에 추가
  image?: string;
}
