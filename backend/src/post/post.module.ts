import { Module } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentService } from '@/comment/comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, CommentService],
  exports: [PostService],
})
export class PostModule {}
