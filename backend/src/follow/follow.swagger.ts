import { FollowStatus } from '@/common/status/follow-status';
import { pageMetaSchema, PageSwaggerQuery } from '@/common/swagger/page.swagger';
import { userCommonSchema } from '@/common/swagger/select.swagger';
import { SwaggerAuthName } from '@/config/swagger.config';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export const ApiToggleFollowUser = () =>
  applyDecorators(
    ApiTags('follow'),
    ApiBearerAuth(SwaggerAuthName),
    ApiParam({
      name: 'id',
      description: '팔로우할 사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '팔로우/언팔로우 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              targetId: { type: 'string' },
              status: {
                type: 'string',
                enum: [FollowStatus.FOLLOW, FollowStatus.UNFOLLOW],
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserFollowers = () =>
  applyDecorators(
    ApiTags('user'),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '사용자의 팔로워 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: userCommonSchema,
          },
          meta: pageMetaSchema,
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserFollowing = () =>
  applyDecorators(
    ApiTags('user'),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '사용자의 팔로잉 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: userCommonSchema,
          },
          meta: pageMetaSchema,
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserFollowersCount = () =>
  applyDecorators(
    ApiTags('user'),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '사용자의 팔로워 수 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              followersCount: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserFollowingCount = () =>
  applyDecorators(
    ApiTags('user'),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '사용자의 팔로잉 수 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              followersCount: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
