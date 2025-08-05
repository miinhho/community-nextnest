import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Swagger 인증 정보에 사용되는 이름
 */
export const SwaggerAuthName = 'JWT-auth' as const;

/**
 * Swagger API 문서화에서 JWT 인증을 적용하는 데코레이터
 */
export const ApiJwtAuth = () => ApiBearerAuth(SwaggerAuthName);
