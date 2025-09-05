import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 기본 설정
 *
 * @property {string} url - redis URL
 */
export default registerAs('redis', () => ({
  url: process.env.REDIS_URL!,
}));
