import { CommentRepository } from '@/comment/comment.repository';
import { CommentOwnerGuard } from '@/comment/guard/comment-owner.guard';
import { ValidateModule } from '@/common/validate/validate.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule, ValidateModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentOwnerGuard],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
