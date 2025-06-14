import { ValidateService } from '@/common/validate/validate.service';
import { PostOwnerGuard } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostOwnerGuard,
    PrismaService,
    ValidateService,
  ],
  exports: [PostService, PostRepository],
})
export class PostModule {}
