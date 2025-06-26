import { LoginUserDto } from '@/auth/dto/login.dto';
import { RegisterUserDto } from '@/auth/dto/register.dto';
import { ApiJwtAuth } from '@/common/swagger/auth-info.swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({
      summary: '회원가입',
      description: '새로운 사용자 계정을 생성합니다.',
    }),
    ApiBody({
      description: '회원가입 정보',
      type: RegisterUserDto,
      schema: {
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
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
              id: { type: 'string' },
              role: { type: 'enum', enum: [Role.USER, Role.ADMIN] },
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
    ApiOperation({
      summary: '로그인',
      description: '이메일과 비밀번호로 로그인합니다.',
    }),
    ApiBody({
      description: '로그인 정보',
      type: LoginUserDto,
      schema: {
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
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
              id: { type: 'string' },
              role: { type: 'enum', enum: [Role.USER, Role.ADMIN] },
              accessToken: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: '잘못된 이메일입니다' }),
    ApiUnauthorizedResponse({ description: '잘못된 비밀번호입니다' }),
    ApiBadRequestResponse({ description: '잘못된 형식의 이메일이나 비밀번호입니다' }),
    ApiInternalServerErrorResponse({ description: '서버 오류' }),
  );

export const ApiLogout = () =>
  applyDecorators(
    ApiJwtAuth(),
    ApiOperation({
      summary: '로그아웃',
      description: '현재 세션을 종료하고 로그아웃합니다.',
    }),
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
    ApiJwtAuth(),
    ApiOperation({
      summary: '토큰 갱신',
      description: '만료된 액세스 토큰을 갱신합니다.',
    }),
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
