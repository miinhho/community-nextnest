import { LoginUserDto } from '@/auth/dto/login.dto';
import { RegisterUserDto } from '@/auth/dto/register.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const ApiRegister = () =>
  applyDecorators(
    ApiBody({
      description: '회원가입 정보',
      type: RegisterUserDto,
      schema: {
        properties: {
          name: { type: 'string', description: '사용자 이름' },
          email: { type: 'string', format: 'email', description: '이메일 주소' },
          password: { type: 'string', description: '비밀번호' },
        },
        required: ['email', 'password', 'name'],
      },
    }),
    ApiOkResponse({
      description: '회원가입 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  role: { type: 'enum', enum: [Role.USER, Role.ADMIN] },
                },
              },
              accessToken: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({ description: '이미 사용 중인 이메일입니다' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiLogin = () =>
  applyDecorators(
    ApiBody({
      description: '로그인 정보',
      type: LoginUserDto,
      schema: {
        properties: {
          email: { type: 'string', format: 'email', description: '이메일 주소' },
          password: { type: 'string', description: '비밀번호' },
        },
        required: ['email', 'password'],
      },
    }),
    ApiOkResponse({
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  role: { type: 'enum', enum: [Role.USER, Role.ADMIN] },
                },
              },
              accessToken: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '잘못된 이메일입니다' }),
    ApiBadRequestResponse({ description: '잘못된 비밀번호입니다' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiLogout = () =>
  applyDecorators(
    ApiOkResponse({
      description: '로그아웃 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    }),
    ApiNotFoundResponse({ description: '토큰이 존재하지 않습니다' }),
    ApiUnauthorizedResponse({ description: '토큰이 유효하지 않습니다' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiRefresh = () =>
  applyDecorators(
    ApiOkResponse({
      description: '토큰 갱신 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '토큰이 존재하지 않습니다' }),
    ApiUnauthorizedResponse({ description: '토큰이 유효하지 않습니다' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );
