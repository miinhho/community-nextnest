import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Backend',
      logLevels: ['error', 'warn'],
      // production 이나 클라우드, 로그 서비스를 사용할 때 키지만
      // 현재는 development 환경이므로 꺼둔다.
      // json: true,
    }),
  });
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: config.get('CORS_ORIGIN')!,
    credentials: true,
  });

  await app.listen(config.get('PORT') ?? 3000);
}

void bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
