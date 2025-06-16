import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsContent = (min: number, max: number) =>
  applyDecorators(
    IsString(),
    MinLength(min, {
      message: `${min}글자 이상의 내용을 적어주세요.`,
    }),
    MaxLength(max, {
      message: '최대 글자 수에 도달했습니다.',
    }),
    ApiProperty({
      type: String,
      description: '댓글 내용',
      maxLength: max,
      minLength: min,
    }),
  );
