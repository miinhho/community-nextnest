import { ApiTags } from '@nestjs/swagger';

// Swagger API 문서화에서 사용되는 태그를 정의하는 데코레이터
// 각 API 엔드포인트에 적용하여 그룹화합니다.

export const ApiUserTags = () => ApiTags('user');
export const ApiFollowTags = () => ApiTags('follow');
export const ApiPostTags = () => ApiTags('post');
export const ApiCommentTags = () => ApiTags('comment');
export const ApiAuthTags = () => ApiTags('auth');
export const ApiHealthCheckTags = () => ApiTags('health-check');
export const ApiBlockTags = () => ApiTags('block');
