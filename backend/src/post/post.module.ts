import { CommentService } from '@/comment/comment.service';
import { PostOwnerGuard } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PrismaService,
    CommentService,
    PostRepository,
    PostOwnerGuard,
    UserService,
  ],
  exports: [PostService],
})
export class PostModule {}
