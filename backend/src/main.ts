import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: app.get('CORS_ORIGIN')!,
    credentials: true,
  });

  await app.listen(config.get('PORT') ?? 3000);
}

void bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
