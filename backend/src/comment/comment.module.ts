import { CommentRepository } from '@/comment/comment.repository';
import { CommentOwnerGuard } from '@/comment/guard/comment-owner.guard';
import { PrismaService } from '@/common/database/prisma.service';
import { ValidateService } from '@/common/validate/validate.service';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    PrismaService,
    CommentRepository,
    CommentOwnerGuard,
    ValidateService,
  ],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
