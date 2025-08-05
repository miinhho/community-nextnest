import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 기본 설정
 *
 * @property {string} url - redis URL
 * @property {string} password - redis 비밀번호
 */
export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
}));
