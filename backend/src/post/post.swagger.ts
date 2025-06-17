import { PageSwaggerQuery, pageMetaSchema } from '@/common/swagger/page.swagger';
import { postCommonSchema, userCommonSchema } from '@/common/swagger/select.swagger';
import { CONTENT_LEN } from '@/common/utils/content';
import { SwaggerAuthName } from '@/config/swagger.config';
import { PostContentDto } from '@/post/dto/post.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const postContentDtoSwagger = {
  description: '게시글 생성 요청 데이터',
  type: PostContentDto,
  schema: {
    properties: {
      content: {
        type: 'string',
        description: '게시글 내용',
        minLength: CONTENT_LEN.MIN,
        maxLength: CONTENT_LEN.MAX,
      },
    },
  },
};

export const ApiCreatePost = () =>
  applyDecorators(
    ApiTags('post'),
    ApiBearerAuth(SwaggerAuthName),
    ApiOperation({
      summary: '게시글 생성',
      description: '새로운 게시글을 작성합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '게시글 ID',
      type: String,
      required: true,
    }),
    ApiBody(postContentDtoSwagger),
    ApiOkResponse({
      description: '게시글 생성 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              postId: { type: 'string' },
              authorId: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }),
  );

export const ApiUpdatePost = () =>
  applyDecorators(
    ApiTags('post'),
    ApiBearerAuth(SwaggerAuthName),
    ApiOperation({
      summary: '게시글 수정',
      description: '기존 게시글의 내용을 수정합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '게시글 ID',
      type: String,
      required: true,
    }),
    ApiBody(postContentDtoSwagger),
    ApiOkResponse({
      description: '게시글 수정 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              authorId: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시글' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiDeletePost = () =>
  applyDecorators(
    ApiTags('post'),
    ApiBearerAuth(SwaggerAuthName),
    ApiOperation({
      summary: '게시글 삭제',
      description: '게시글을 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '게시글 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '게시글 삭제 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              authorId: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시글' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiTogglePostLike = () =>
  applyDecorators(
    ApiTags('post'),
    ApiBearerAuth(SwaggerAuthName),
    ApiOperation({
      summary: '게시글 좋아요 토글',
      description: '게시글의 좋아요 상태를 토글합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '게시글 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '게시글 좋아요 토글 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['PLUS', 'MINUS'] },
              id: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시글' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiFindPostById = () =>
  applyDecorators(
    ApiTags('post'),
    ApiOperation({
      summary: '게시글 조회',
      description: 'ID로 특정 게시글의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '게시글 ID',
      type: String,
      required: true,
    }),
    ApiOkResponse({
      description: '게시글 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              ...postCommonSchema.properties,
              authorId: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시글' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetUserPosts = () =>
  applyDecorators(
    ApiTags('user'),
    ApiOperation({
      summary: '사용자 게시글 목록 조회',
      description: '특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '사용자의 게시글 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              posts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...postCommonSchema.properties,
                    authorId: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    commentCount: { type: 'number' },
                  },
                },
              },
              meta: pageMetaSchema,
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 사용자' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiFindPosts = () =>
  applyDecorators(
    ApiTags('post'),
    ApiOperation({
      summary: '게시글 목록 조회',
      description: '모든 게시글 목록을 페이지네이션으로 조회합니다.',
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '게시글 목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              posts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...postCommonSchema.properties,
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    commentCount: { type: 'number' },
                    author: userCommonSchema,
                  },
                },
              },
              meta: pageMetaSchema,
            },
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
