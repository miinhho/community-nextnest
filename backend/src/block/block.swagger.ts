import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const ApiBlockUser = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 차단',
      description:
        '특정 사용자를 차단합니다. 차단된 사용자는 차단한 사용자로부터의 모든 상호작용이 제한됩니다.',
    }),
    ApiBody({
      description: '차단할 사용자 ID',
      type: String,
      required: true,
      schema: {
        type: 'object',
        properties: {
          targetId: { type: 'string', description: '차단할 사용자 ID' },
        },
      },
    }),
    ApiOkResponse({
      description: '사용자 차단 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiBadRequestResponse({ description: '이미 차단된 사용자' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiUnblockUser = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '사용자 차단 해제',
      description: '차단된 사용자의 차단을 해제합니다.',
    }),
    ApiBody({
      description: '차단 해제할 사용자 ID',
      type: String,
      required: true,
      schema: {
        type: 'object',
        properties: {
          targetId: { type: 'string', description: '차단 해제할 사용자 ID' },
        },
      },
    }),
    ApiOkResponse({
      description: '사용자 차단 해제 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiBadRequestResponse({ description: '차단되지 않은 사용자' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
