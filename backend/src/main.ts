import { SwaggerAuthName } from '@/config/swagger.config';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Backend',
      logLevels: ['error', 'warn', 'log'],
      timestamp: true,
      json: process.env.NODE_ENV === 'production',
    }),
  });

  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.enableCors({
    origin: config.get('app.origin')!,
    credentials: true,
  });

  app.use(helmet());

  const swaggerDocument = new DocumentBuilder()
    .setTitle(config.get('swagger.title')!)
    .setDescription(config.get('swagger.description')!)
    .setVersion(config.get('swagger.version')!)
    .addBearerAuth(config.get('swagger.bearerAuth'), SwaggerAuthName)
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerDocument, {
      autoTagControllers: false,
    });
  SwaggerModule.setup('api', app, documentFactory());

  app.enableShutdownHooks();

  await app.listen(config.get('app.port')!);
}

void bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
