import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 컨텐츠 유효성 검사 데코레이터
 *
 * 문자열 타입 검증, 최소/최대 길이 검증, Swagger API 문서화를 조합한 데코레이터입니다.
 * 댓글이나 게시물 내용과 같은 텍스트 컨텐츠 필드에 사용됩니다.
 *
 * @param min - 최소 문자 길이
 * @param max - 최대 문자 길이
 * @returns 조합된 데코레이터 함수
 *
 * @example
 * ```typescript
 * class CreatePostDto {
 *   ＠IsContent(10, 1000)
 *   content: string;
 * }
 * ```
 *
 * @example
 * ```typescript
 * class CreateCommentDto {
 *   ＠IsContent(1, 500)
 *   comment: string;
 * }
 * ```
 */
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
