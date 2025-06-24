import { SwaggerAuthName } from '@/config/swagger.config';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiUpdateUserPrivacy = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiOperation({
      summary: '사용자 공개 여부 수정',
      description: '사용자의 공개 여부를 수정합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiBody({
      description: '사용자 공개 여부 수정 정보',
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          isPrivate: { type: 'boolean' },
        },
      },
      required: true,
    }),
    ApiOkResponse({
      description: '사용자 공개 여부 수정 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserIsPrivate = () =>
  applyDecorators(
    ApiOperation({
      summary: '사용자 공개 여부 조회',
      description: '사용자의 공개 여부를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '사용자 공개 여부 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              isPrivate: { type: 'boolean' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 사용자' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
