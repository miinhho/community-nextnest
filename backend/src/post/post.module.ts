import { BlockModule } from '@/block/block.module';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { PostCacheService } from '@/post/cache/post-cache.service';
import { PostOwnerGuard } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { PostRecommendService } from '@/post/recommend/post-recommend.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrivateModule } from '@/private/private.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule, PrivateModule, BlockModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostOwnerGuard,
    PostRecommendService,
    PostCacheService,
    NotifyPublisher,
  ],
  exports: [PostService, PostRepository],
})
export class PostModule {}
