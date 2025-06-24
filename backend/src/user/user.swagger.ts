import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { userCommonSchema } from '@/common/swagger/select.swagger';
import { UpdateUserDto } from '@/user/dto/user.dto';
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
import { Role } from '@prisma/client';

export const ApiGetUserById = () =>
  applyDecorators(
    ApiOperation({
      summary: '사용자 조회',
      description:
        'ID로 특정 사용자의 정보를 조회합니다. 비공개 사용자의 경우, 요청자가 팔로우한 사용자만 조회할 수 있습니다.',
    }),
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
              email: { type: 'string', format: 'email' },
              emailVerified: { type: 'string', format: 'date-time', nullable: true },
              followingCount: { type: 'number' },
              followerCount: { type: 'number' },
              postCount: { type: 'number' },
              role: { type: 'string', enum: [Role.ADMIN, Role.USER] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiUnauthorizedResponse({ description: '비공개 사용자 조회는 인증이 요구됨' }),
    ApiForbiddenResponse({
      description: '비공개 사용자의 경우, 팔로우한 사용자만 조회 가능',
    }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiUpdateUser = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 정보 수정',
      description: '사용자의 프로필 정보를 수정합니다.',
    }),
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
          image: { type: 'string', nullable: true },
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
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 삭제',
      description: '사용자 계정을 삭제합니다.',
    }),
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
              email: { type: 'string', format: 'email' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
