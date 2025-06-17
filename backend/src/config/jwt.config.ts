import { registerAs } from '@nestjs/config';

/**
 * JWT 토큰 설정
 *
 * JWT 액세스 토큰과 리프레시 토큰의 비밀키와 만료시간을 환경변수로부터 설정하는 모듈입니다.
 * 인증 시스템에서 토큰 생성 및 검증에 사용되는 핵심 설정값들을 관리합니다.
 *
 * @example
 * ```
 * // AuthModule에서 사용
 * JwtModule.registerAsync({
 *   inject: [jwtConfig.KEY],
 *   useFactory: (config: ConfigType<typeof jwtConfig>) => ({
 *     secret: config.accessSecret,
 *     signOptions: { expiresIn: config.accessExpiration }
 *   })
 * })
 *
 * // AuthService에서 사용
 * constructor(
 *   ＠Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>
 * ) {}
 * ```
 *
 * @returns JWT 설정 객체
 * @property {string} accessSecret - 액세스 토큰 서명용 비밀키 (필수)
 * @property {number} accessExpiration - 액세스 토큰 만료시간 (초 단위, 필수)
 * @property {string} refreshSecret - 리프레시 토큰 서명용 비밀키 (필수)
 * @property {number} refreshExpiration - 리프레시 토큰 만료시간 (초 단위, 필수)
 *
 * @requires JWT_ACCESS_SECRET - 환경변수: 액세스 토큰 비밀키
 * @requires JWT_ACCESS_EXPIRATION - 환경변수: 액세스 토큰 만료시간
 * @requires JWT_REFRESH_SECRET - 환경변수: 리프레시 토큰 비밀키
 * @requires JWT_REFRESH_EXPIRATION - 환경변수: 리프레시 토큰 만료시간
 */
export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION!, 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  refreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION!, 10),
}));
