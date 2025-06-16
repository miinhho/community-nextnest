import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useLogger(config.get<ConsoleLogger>('log.logger')!);
  app.use(cookieParser());
  app.enableCors({
    origin: config.get('app.origin')!,
    credentials: true,
  });

  await app.listen(config.get('app.port') ?? 3000);
}

void bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
