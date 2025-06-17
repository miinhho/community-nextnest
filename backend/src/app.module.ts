import { JwtAuthGuard } from '@/auth/guard/jwt.guard';
import app from '@/config/app.config';
import jwt from '@/config/jwt.config';
import swagger from '@/config/swagger.config';
import { HealthModule } from '@/health/health.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwt, app, swagger],
      isGlobal: true,
      cache: true,
    }),
    PostModule,
    UserModule,
    CommentModule,
    FollowModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
