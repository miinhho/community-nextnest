import { CreateCommentDto, UpdateCommentDto } from '@/comment/dto/comment.dto';
import { ReplyContentDto } from '@/comment/dto/reply.dto';
import { LikeStatus } from '@/common/status/like-status';
import { PaginationMetaSchema } from '@/common/swagger/page.swagger';
import {
  CommentCommonSchema,
  PostCommonSchema,
  UserCommonSchema,
} from '@/common/swagger/select.swagger';
import { COMMENT_LEN } from '@/common/utils/content';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

export const ApiCreateComment = () =>
  applyDecorators(
    ApiTags('comment'),
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
    ApiTags('comment'),
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
    ApiTags('comment'),
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
    ApiTags('comment'),
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
    ApiTags('comment'),
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
              ...CommentCommonSchema.properties,
              postId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              author: {
                ...UserCommonSchema,
              },
              replies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...CommentCommonSchema.properties,
                    author: {
                      ...UserCommonSchema,
                    },
                  },
                },
              },
              parent: {
                type: 'object',
                nullable: true,
                properties: {
                  ...CommentCommonSchema.properties,
                  author: {
                    ...UserCommonSchema,
                  },
                },
              },
            },
          },
        },
      },
    }),
  );

export const ApiGetCommentsByPostId = () =>
  applyDecorators(
    ApiTags('post'),
    ApiParam({
      name: 'id',
      description: '댓글을 조회할 게시물의 ID',
      type: 'string',
      format: 'uuid',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      type: 'integer',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 댓글 수 (기본값: 10)',
      type: 'integer',
      example: 10,
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
              meta: PaginationMetaSchema,
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
    ApiParam({
      name: 'id',
      description: '댓글을 조회할 사용자의 ID',
      type: 'string',
      format: 'uuid',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      type: 'integer',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 댓글 수 (기본값: 10)',
      type: 'integer',
      example: 10,
    }),
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
                    ...CommentCommonSchema.properties,
                    postId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    post: {
                      ...PostCommonSchema,
                    },
                  },
                },
              },
              meta: PaginationMetaSchema,
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '존재하지 않는 사용자입니다.' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
