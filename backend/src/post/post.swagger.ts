import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { ApiPageQuery, pageMetaSchema } from '@/common/swagger/page.swagger';
import { postCommonSchema, userCommonSchema } from '@/common/swagger/select.swagger';
import { ApiPostTags, ApiUserTags } from '@/common/swagger/tags.swagger';
import { CONTENT_LEN } from '@/common/utils/content';
import { PostContentDto } from '@/post/dto/post.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
    ApiPostTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '게시글 생성',
      description: '새로운 게시글을 작성합니다.',
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
            },
          },
        },
      },
    }),
  );

export const ApiUpdatePost = () =>
  applyDecorators(
    ApiPostTags(),
    ApiJwtAuth(),
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
    ApiPostTags(),
    ApiJwtAuth(),
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
    ApiPostTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '게시글 좋아요 토글',
      description:
        '게시글의 좋아요 상태를 토글합니다. 비공개 게시글은 작성자와 팔로워만 좋아요를 토글할 수 있습니다.',
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
    ApiPostTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '게시글 조회',
      description:
        'ID로 특정 게시글의 상세 정보를 조회합니다. 게시글이 비공개인 경우, 해당 게시글의 작성자와 팔로워인 사용자만 조회할 수 있습니다.',
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
              author: userCommonSchema,
              commentCount: { type: 'number' },
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
    ApiUserTags(),
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 게시글 목록 조회',
      description:
        '특정 사용자가 작성한 게시글 목록을 페이지네이션으로 조회합니다. 비공개 사용자인 경우, 해당 사용자의 팔로워만 조회할 수 있습니다.',
    }),
    ApiParam({
      name: 'id',
      description: '사용자 ID',
      type: String,
      required: true,
    }),
    ApiPageQuery(),
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
    ApiUnauthorizedResponse({
      description: '비공개 사용자의 게시글에 접근하기 위해 인증이 필요함',
    }),
    ApiForbiddenResponse({ description: '비공개 사용자의 게시글에 접근할 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiFindPosts = () =>
  applyDecorators(
    ApiPostTags(),
    ApiOperation({
      summary: '게시글 목록 조회',
      description:
        '모든 게시글 목록을 페이지네이션으로 조회합니다. 비공개 게시글은 작성자와 팔로워만 조회할 수 있습니다.',
    }),
    ApiPageQuery(),
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
