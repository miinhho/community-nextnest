import { registerAs } from '@nestjs/config';

export const SwaggerAuthName = 'JWT-auth';

export default registerAs('swagger', () => ({
  title: 'Community API',
  description: 'API documentation for the Community application',
  version: '1.0',
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    description: 'JWT 토큰을 입력하세요',
  },
}));
