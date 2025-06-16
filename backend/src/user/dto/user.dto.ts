import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: '이름을 입력해주세요',
  })
  @MaxLength(15, {
    message: '이름은 15글자를 넘어갈 수 없습니다',
  })
  @ApiPropertyOptional({
    type: String,
    description: '사용자 이름',
    maxLength: 15,
    minLength: 1,
  })
  name?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    type: String,
    description: '사용자 이미지 URL',
    format: 'uri',
    nullable: true,
  })
  image?: string;
}
