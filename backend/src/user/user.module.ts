import { PrismaService } from '@/common/database/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CommentService } from '@/comment/comment.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CommentService],
  exports: [UserService],
})
export class UserModule {}
