/* eslint-disable @typescript-eslint/require-await */
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/guard/jwt.guard';
import { BlockModule } from '@/block/block.module';
import { CommentModule } from '@/comment/comment.module';
import config from '@/config';
import { FollowModule } from '@/follow/follow.module';
import { HealthModule } from '@/health/health.module';
import { NotifyModule } from '@/notify/notify.module';
import { PostModule } from '@/post/post.module';
import { PrivateModule } from '@/private/private.module';
import { UserModule } from '@/user/user.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : process.env.NODE_ENV === 'test'
            ? '.env.test.local'
            : '.env.development.local',
      load: config,
      isGlobal: true,
      cache: true,
    }),
    EventEmitterModule.forRoot(),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          readyLog: true,
          config: {
            url: configService.get<string>('redis.url'),
            password: configService.get<string>('redis.password'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PostModule,
    UserModule,
    CommentModule,
    FollowModule,
    AuthModule,
    PrivateModule,
    BlockModule,
    HealthModule,
    NotifyModule,
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
