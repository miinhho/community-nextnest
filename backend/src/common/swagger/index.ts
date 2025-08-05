import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setUpSwagger = (app: INestApplication<any>) => {
  const swaggerDocument = new DocumentBuilder()
    .setTitle('Community API')
    .setDescription('API documentation for the Community application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'JWT 토큰을 입력하세요',
      },
      SwaggerAuthName,
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerDocument, {
      autoTagControllers: false,
    });
  SwaggerModule.setup('api', app, documentFactory());
};

/**
 * Swagger 인증 정보에 사용되는 이름
 */
export const SwaggerAuthName = 'JWT-auth' as const;
