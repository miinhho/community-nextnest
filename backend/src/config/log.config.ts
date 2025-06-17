import { ConsoleLoggerOptions } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

/**
 * 개발 환경용 로그 설정
 *
 * 개발 환경에서 사용할 로그 옵션을 정의합니다.
 * 모든 로그 레벨을 출력하고 타임스탬프를 포함하여 디버깅에 유용한 형태로 설정합니다.
 *
 * @constant {ConsoleLoggerOptions} development
 * @property {string} prefix - 로그 메시지 앞에 붙을 접두사
 * @property {string[]} logLevels - 출력할 로그 레벨 (error, warn, log, debug 모두 포함)
 * @property {boolean} timestamp - 타임스탬프 포함 여부
 */
const development: ConsoleLoggerOptions = {
  prefix: 'Backend',
  logLevels: ['error', 'warn', 'log', 'debug'],
  timestamp: true,
};

/**
 * 프로덕션 환경용 로그 설정
 *
 * 프로덕션 환경에서 사용할 로그 옵션을 정의합니다.
 * 디버그 로그를 제외하고 JSON 형태로 출력하여 로그 수집 시스템에서 파싱하기 용이하도록 설정합니다.
 *
 * @constant {ConsoleLoggerOptions} production
 * @property {string} prefix - 로그 메시지 앞에 붙을 접두사
 * @property {string[]} logLevels - 출력할 로그 레벨 (debug 제외)
 * @property {boolean} timestamp - 타임스탬프 포함 여부
 * @property {boolean} json - JSON 형태로 출력 여부
 */
const production: ConsoleLoggerOptions = {
  prefix: 'Backend',
  logLevels: ['error', 'warn', 'log'],
  timestamp: true,
  json: true,
};

/**
 * 로깅 설정
 *
 * 애플리케이션의 로깅 동작을 환경에 따라 설정하는 모듈입니다.
 * 개발 환경에서는 디버그 정보까지 포함한 상세한 로그를,
 * 프로덕션 환경에서는 필요한 로그만 JSON 형태로 출력합니다.
 *
 * @module LogConfig
 *
 * @example
 * ```typescript
 * // main.ts에서 사용
 * const app = await NestFactory.create(AppModule, {
 *   logger: configService.get('log.options')
 * });
 *
 * // 커스텀 로거에서 사용
 * constructor(
 *   ＠Inject(logConfig.KEY) private config: ConfigType<typeof logConfig>
 * ) {}
 *
 * const loggerOptions = this.config.options;
 * ```
 *
 * @returns 로그 설정 객체
 * @property {ConsoleLoggerOptions} options - 현재 환경에 맞는 로그 옵션
 */
export default registerAs('log', () => ({
  options: process.env.NODE_ENV === 'production' ? production : development,
}));
