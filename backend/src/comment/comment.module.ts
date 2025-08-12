import { CommentRepository } from '@/comment/comment.repository';
import { CommentOwnerGuard } from '@/comment/guard/comment-owner.guard';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentOwnerGuard, NotifyPublisher],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
