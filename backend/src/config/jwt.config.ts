import { registerAs } from '@nestjs/config';

/**
 * JWT 토큰 설정
 *
 * @property {string} accessSecret - 액세스 토큰 서명용 비밀키 (필수)
 * @property {number} accessExpiration - 액세스 토큰 만료시간 (초 단위, 필수)
 * @property {string} refreshSecret - 리프레시 토큰 서명용 비밀키 (필수)
 * @property {number} refreshExpiration - 리프레시 토큰 만료시간 (초 단위, 필수)
 */
export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION!, 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  refreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION!, 10),
}));
