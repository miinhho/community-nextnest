import { alphabetNumbericRegex, specialCharRegex } from '@/common/utils/regex';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail(
    {},
    {
      message: '유효한 이메일 주소가 아닙니다.',
    },
  )
  @ApiProperty({
    type: String,
    description: '사용자 이메일',
  })
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
  @ApiProperty({
    type: String,
    description: '사용자 비밀번호',
    minLength: 8,
    maxLength: 25,
    pattern: alphabetNumbericRegex.source + '|' + specialCharRegex.source,
  })
  password: string;
}
