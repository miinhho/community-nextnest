import { FollowStatus } from '@/common/status';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiPageQuery, pageMetaSchema } from '@/common/swagger/page.swagger';
import { userCommonSchema } from '@/common/swagger/select.swagger';
import { ApiUserTags } from '@/common/swagger/tags.swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export const ApiToggleFollowUser = () =>
  applyDecorators(
    ApiUserTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '팔로우 토글',
      description: '사용자의 팔로우 상태를 토글합니다.',
    }),
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

export const ApiSendFollowRequest = () =>
  applyDecorators(
    ApiUserTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '팔로우 요청',
      description: '사용자에게 팔로우 요청을 보냅니다.',
    }),
    ApiParam({
      name: 'id',
      description: '팔로우 요청할 사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '팔로우 요청 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              targetId: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiRejectFollowRequest = () =>
  applyDecorators(
    ApiUserTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '팔로우 요청 거절',
      description: '사용자의 팔로우 요청을 거절합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '팔로우 요청을 거절할 사용자 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '팔로우 요청 거절 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              targetId: { type: 'string' },
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
    ApiUserTags(),
    ApiOperation({
      summary: '팔로워 목록 조회',
      description: '특정 사용자의 팔로워 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiPageQuery(),
    ApiOkResponse({
      description: '사용자의 팔로워 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              followers: {
                type: 'array',
                items: userCommonSchema,
              },
            },
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
    ApiUserTags(),
    ApiOperation({
      summary: '팔로잉 목록 조회',
      description: '특정 사용자가 팔로우하는 사용자 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiPageQuery(),
    ApiOkResponse({
      description: '사용자의 팔로잉 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              following: {
                type: 'array',
                items: userCommonSchema,
              },
            },
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
    ApiUserTags(),
    ApiOperation({
      summary: '팔로워 수 조회',
      description: '특정 사용자의 팔로워 수를 조회합니다.',
    }),
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
    ApiUserTags(),
    ApiOperation({
      summary: '팔로잉 수 조회',
      description: '특정 사용자가 팔로우하는 사용자 수를 조회합니다.',
    }),
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
              followingCount: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
