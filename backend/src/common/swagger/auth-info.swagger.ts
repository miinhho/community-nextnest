import { SwaggerAuthName } from '@/config/swagger.config';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Swagger API 문서화에서 JWT 인증을 적용하는 데코레이터
 */
export const ApiJwtAuth = () => ApiBearerAuth(SwaggerAuthName);
