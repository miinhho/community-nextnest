import { CreateCommentDto, UpdateCommentDto } from '@/comment/dto/comment.dto';
import { ReplyContentDto } from '@/comment/dto/reply.dto';
import { LikeStatus } from '@/common/status/like-status';
import { PageSwaggerQuery, pageMetaSchema } from '@/common/swagger/page.swagger';
import {
  commentCommonSchema,
  postCommonSchema,
  userCommonSchema,
} from '@/common/swagger/select.swagger';
import { COMMENT_LEN } from '@/common/utils/content';
import { SwaggerAuthName } from '@/config/swagger.config';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export const ApiCreateComment = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 생성',
      description: '게시글에 새로운 댓글을 작성합니다.',
    }),
    ApiBody({
      description: '댓글 생성 요청 데이터',
      type: CreateCommentDto,
      schema: {
        type: 'object',
        properties: {
          postId: {
            type: 'string',
            format: 'uuid',
            description: '댓글이 달릴 게시글의 ID',
          },
          content: {
            type: 'string',
            minLength: COMMENT_LEN.MIN,
            maxLength: COMMENT_LEN.MAX,
          },
        },
      },
    }),
    ApiOkResponse({
      description: '댓글 생성 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              commentId: { type: 'string' },
              postId: { type: 'string' },
              authorId: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시물입니다.' }),
    ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiCreateCommentReply = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiTags('comment'),
    ApiOperation({
      summary: '답글 생성',
      description: '댓글에 답글을 작성합니다.',
    }),
    ApiBody({
      description: '답글 생성 요청 데이터',
      type: ReplyContentDto,
      schema: {
        type: 'object',
        properties: {
          postId: {
            type: 'string',
            format: 'uuid',
            description: '답글이 달릴 게시글의 ID',
          },
          commentId: {
            type: 'string',
            format: 'uuid',
            description: '답글이 달릴 댓글의 ID',
          },
          content: {
            type: 'string',
            minLength: COMMENT_LEN.MIN,
            maxLength: COMMENT_LEN.MAX,
          },
        },
      },
    }),
    ApiOkResponse({
      description: '답글 생성 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              replyId: { type: 'string' },
              postId: { type: 'string' },
              authorId: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 댓글이나 게시물입니다.' }),
    ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiUpdateComment = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 수정',
      description: '기존 댓글의 내용을 수정합니다.',
    }),
    ApiBody({
      description: '댓글 수정 요청 데이터',
      type: UpdateCommentDto,
      schema: {
        type: 'object',
        properties: {
          commentId: {
            type: 'string',
            format: 'uuid',
            description: '수정할 댓글의 ID',
          },
          content: {
            type: 'string',
            minLength: COMMENT_LEN.MIN,
            maxLength: COMMENT_LEN.MAX,
          },
        },
      },
    }),
    ApiOkResponse({
      description: '댓글 수정 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              commentId: { type: 'string' },
            },
          },
          message: { type: 'string', example: '댓글이 성공적으로 수정되었습니다.' },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' }),
    ApiBadRequestResponse({ description: '잘못된 요청 형식입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiDeleteComment = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 삭제',
      description: '댓글을 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '삭제할 댓글의 ID',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: '댓글 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string', example: '댓글이 성공적으로 삭제되었습니다.' },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiToggleCommentLike = () =>
  applyDecorators(
    ApiBearerAuth(SwaggerAuthName),
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 좋아요 토글',
      description: '댓글의 좋아요 상태를 토글합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '좋아요/싫어요를 토글할 댓글의 ID',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: '댓글 좋아요/싫어요 토글 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: [LikeStatus.PLUS, LikeStatus.MINUS] },
              commentId: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetCommentById = () =>
  applyDecorators(
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 조회',
      description: 'ID로 특정 댓글의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '조회할 댓글의 ID',
      type: 'string',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: '댓글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              ...commentCommonSchema.properties,
              postId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              author: {
                ...userCommonSchema,
              },
              replies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...commentCommonSchema.properties,
                    author: {
                      ...userCommonSchema,
                    },
                  },
                },
              },
              parent: {
                type: 'object',
                nullable: true,
                properties: {
                  ...commentCommonSchema.properties,
                  author: {
                    ...userCommonSchema,
                  },
                },
              },
            },
          },
        },
      },
    }),
  );

export const ApiGetCommentReplies = () =>
  applyDecorators(
    ApiTags('comment'),
    ApiOperation({
      summary: '댓글 답글 목록 조회',
      description: '특정 댓글의 답글 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '조회할 댓글의 ID',
      type: 'string',
      format: 'uuid',
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '댓글 답글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              replies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...commentCommonSchema.properties,
                    author: userCommonSchema,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 댓글입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetCommentsByPostId = () =>
  applyDecorators(
    ApiTags('post'),
    ApiOperation({
      summary: '게시글 댓글 목록 조회',
      description: '특정 게시글의 댓글 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '댓글을 조회할 게시물의 ID',
      type: 'string',
      format: 'uuid',
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '댓글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              postId: { type: 'string' },
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    content: { type: 'string' },
                    likesCount: { type: 'number' },
                    author: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        image: { type: 'string', nullable: true },
                      },
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              meta: pageMetaSchema,
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 게시물입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiGetCommentsByUserId = () =>
  applyDecorators(
    ApiTags('user'),
    ApiOperation({
      summary: '사용자 댓글 목록 조회',
      description: '특정 사용자가 작성한 댓글 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '댓글을 조회할 사용자의 ID',
      type: 'string',
      format: 'uuid',
    }),
    PageSwaggerQuery(),
    ApiOkResponse({
      description: '사용자의 댓글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...commentCommonSchema.properties,
                    postId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    post: {
                      ...postCommonSchema,
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
    ApiNotFoundResponse({ description: '존재하지 않는 사용자입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
