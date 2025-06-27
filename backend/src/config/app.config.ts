import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 기본 설정
 *
 * 애플리케이션의 전역 설정값들을 환경변수로부터 읽어와 구성하는 설정 모듈입니다.
 * NestJS의 ConfigModule과 함께 사용되어 애플리케이션 전반에서 설정값에 접근할 수 있습니다.
 *
 * @example
 * ```
 * // ConfigModule에서 사용
 * ConfigModule.forRoot({
 *   load: [appConfig],
 * })
 *
 * // 서비스에서 사용
 * constructor(
 *   ＠Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>
 * ) {}
 *
 * const port = this.config.port;
 * ```
 *
 * @returns 애플리케이션 설정 객체
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
