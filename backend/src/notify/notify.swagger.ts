import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiPageQuery, pageMetaSchema } from '@/common/swagger/page.swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export const ApiGetNotifyById = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '알람 상세 조회',
      description: '특정 알람의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '알람 ID',
      type: String,
    }),
    ApiOkResponse({
      description: '알람 상세 정보 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: [
                  NotificationType.COMMENT_LIKE,
                  NotificationType.COMMENT_REPLY,
                  NotificationType.FOLLOW,
                  NotificationType.MESSAGE,
                  NotificationType.POST_COMMENT,
                  NotificationType.POST_LIKE,
                  NotificationType.SYSTEM,
                ],
              },
              image: { type: 'string', nullable: true },
              title: { type: 'string' },
              content: { type: 'string' },
              isRead: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              postId: { type: 'string', nullable: true },
              commentId: { type: 'string', nullable: true },
              followerId: { type: 'string', nullable: true },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '알람을 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetNotifiesByUserId = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 알람 목록 조회',
      description: '특정 사용자의 알람 목록을 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
    }),
    ApiPageQuery(),
    ApiOkResponse({
      description: '사용자 알람 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              notifies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    type: {
                      type: 'string',
                      enum: [
                        NotificationType.COMMENT_LIKE,
                        NotificationType.COMMENT_REPLY,
                        NotificationType.FOLLOW,
                        NotificationType.MESSAGE,
                        NotificationType.POST_COMMENT,
                        NotificationType.POST_LIKE,
                        NotificationType.SYSTEM,
                      ],
                    },
                    image: { type: 'string', nullable: true },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    isRead: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                      },
                    },
                    postId: { type: 'string', nullable: true },
                    commentId: { type: 'string', nullable: true },
                    follower: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
              meta: pageMetaSchema,
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiForbiddenResponse({ description: '다른 사용자의 알람을 조회할 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiReadNotifyById = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '알람 읽음 처리',
      description: '특정 알람을 읽음 처리합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '알람 ID',
      type: String,
    }),
    ApiOkResponse({
      description: '알람 읽음 처리 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiNotFoundResponse({ description: '알람을 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiReadAllNotifiesByUserId = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 알람 전체 읽음 처리',
      description: '특정 사용자의 모든 알람을 읽음 처리합니다.',
    }),
    ApiOkResponse({
      description: '사용자 알람 전체 읽음 처리 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
