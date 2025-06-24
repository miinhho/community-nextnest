import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Swagger 인증 스키마 이름
 *
 * Swagger UI에서 JWT 인증을 위해 사용되는 보안 스키마의 이름입니다.
 * API 엔드포인트에서 @ApiBearerAuth(SwaggerAuthName)으로 참조됩니다.
 *
 * @constant {string} SwaggerAuthName
 */
const SwaggerAuthName = 'JWT-auth';

/**
 * Swagger API 문서화에서 JWT 인증을 적용하는 데코레이터
 */
export const ApiJwtAuth = () => ApiBearerAuth(SwaggerAuthName);
