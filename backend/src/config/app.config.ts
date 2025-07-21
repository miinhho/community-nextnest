import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 기본 설정
 *
 * @property {string} environment - 현재 실행 환경 (development, production 등)
 * @property {boolean} isProduction - 프로덕션 환경 여부
 * @property {number} port - 애플리케이션 실행 포트 (기본값: 3000)
 * @property {string} origin - CORS 허용 도메인 (기본값: http://localhost:3000)
 */
export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  port: parseInt(process.env.PORT || '3000', 10),
}));
