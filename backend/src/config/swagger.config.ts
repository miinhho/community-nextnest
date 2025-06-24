import { registerAs } from '@nestjs/config';

/**
 * Swagger API 문서화 설정
 *
 * API 문서 자동 생성을 위한 Swagger 설정값들을 정의하는 모듈입니다.
 * API 제목, 설명, 버전 정보와 JWT 인증 방식을 설정합니다.
 *
 * @returns Swagger 설정 객체
 * @property {string} title - API 문서 제목
 * @property {string} description - API 문서 설명
 * @property {string} version - API 버전
 * @property {object} bearerAuth - JWT Bearer 인증 설정
 * @property {string} bearerAuth.type - 인증 타입 (http)
 * @property {string} bearerAuth.scheme - 인증 스키마 (bearer)
 * @property {string} bearerAuth.bearerFormat - 토큰 형식 (JWT)
 * @property {string} bearerAuth.in - 토큰 위치 (header)
 * @property {string} bearerAuth.description - 인증 설명
 */
export default registerAs('swagger', () => ({
  title: 'Community API',
  description: 'API documentation for the Community application',
  version: '1.0',
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    description: 'JWT 토큰을 입력하세요',
  },
}));
