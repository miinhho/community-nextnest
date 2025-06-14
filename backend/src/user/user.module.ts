import { CommentService } from '@/comment/comment.service';
import { PrismaService } from '@/common/database/prisma.service';
import { FollowService } from '@/follow/follow.service';
import { PostService } from '@/post/post.service';
import { UserRepository } from '@/user/user.repository';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    CommentService,
    PostService,
    FollowService,
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
