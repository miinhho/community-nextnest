import { AuthController } from '@/auth/auth.controller';
import { JwtAuthGuard } from '@/auth/guard/jwt.guard';
import { CommentController } from '@/comment/comment.controller';
import { FollowController } from '@/follow/follow.controller';
import { UserController } from '@/user/user.controller';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PostModule, UserModule, CommentModule, FollowModule, AuthModule],
  controllers: [
    PostController,
    UserController,
    FollowController,
    CommentController,
    AuthController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
