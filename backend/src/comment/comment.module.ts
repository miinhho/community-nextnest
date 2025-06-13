import { CommentRepository } from '@/comment/comment.repository';
import { PrismaService } from '@/common/database/prisma.service';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
