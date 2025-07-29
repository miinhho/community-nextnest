import { registerAs } from '@nestjs/config';

/**
 * 애플리케이션 기본 설정
 *
 * @property {number} recommendationStandardDate - 추천 알고리즘의 기준 날짜를 UNIX timestamp 로 변환한 값
 */
export default registerAs('recommend', () => ({
  recommendationStandardDate: new Date(
    process.env.RECOMMENDATION_STANDARD_DATE || '2025-01-01',
  ).getTime(),
}));
