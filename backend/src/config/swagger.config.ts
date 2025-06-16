import { registerAs } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

const swaggerConfig = {
  title: 'Community API',
  description: 'API documentation for the Community application',
  version: '1.0',
};

export type SwaggerDocument = Omit<OpenAPIObject, 'paths'>;

export default registerAs('swagger', () => ({
  document: new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build(),
}));
