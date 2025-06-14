import { alphabetNumbericRegex, specialCharRegex } from '@/common/utils/regex';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @MinLength(1, {
    message: '이름을 입력해주세요',
  })
  @MaxLength(15, {
    message: '이름은 15글자를 넘어갈 수 없습니다',
  })
  name: string;

  @IsString()
  @IsEmail(
    {},
    {
      message: '유효한 이메일 주소가 아닙니다.',
    },
  )
  email: string;

  @IsString()
  @MinLength(8, {
    message: '8글자 이상의 비밀번호를 적어주세요',
  })
  @MaxLength(25, {
    message: '비밀번호는 25글자를 넘어갈 수 없습니다',
  })
  @Matches(alphabetNumbericRegex, {
    message: '영문과 숫자가 모두 포함되어야 합니다',
  })
  @Matches(specialCharRegex, {
    message: '특수문자가 포함되어야 합니다',
  })
  password: string;
}
