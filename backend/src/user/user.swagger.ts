import { userCommonSchema } from '@/common/swagger/select.swagger';
import { SwaggerAuthName } from '@/config/swagger.config';
import { UpdateUserDto } from '@/user/dto/user.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiGetUserById = () =>
  applyDecorators(
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '사용자 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              ...userCommonSchema.properties,
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiUpdateUser = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiBody({
      description: '사용자 수정 정보',
      type: UpdateUserDto,
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', nullable: true },
          image: { type: 'string', description: '사용자 이미지 URL', nullable: true },
        },
      },
      required: true,
    }),
    ApiOkResponse({
      description: '사용자 수정 성공',
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

export const ApiDeleteUser = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '사용자 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              ...userCommonSchema.properties,
              image: { type: 'string', description: '사용자 이미지 URL', nullable: true },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
