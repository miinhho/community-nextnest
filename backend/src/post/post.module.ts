import { ValidateService } from '@/common/validate/validate.service';
import { PostOwnerGuard } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostOwnerGuard, ValidateService],
  exports: [PostService, PostRepository],
})
export class PostModule {}
