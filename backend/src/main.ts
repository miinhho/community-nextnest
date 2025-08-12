import '../instrument';

import { setUpSwagger } from '@/common/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Main API Server',
      logLevels: ['error', 'warn', 'log'],
      timestamp: true,
      json: isProduction,
    }),
  });

  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.use(helmet());

  if (!isProduction) setUpSwagger(app);

  app.enableShutdownHooks();

  await app.listen(config.get('app.port')!);
}

void bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
