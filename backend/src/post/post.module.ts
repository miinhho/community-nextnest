import { ValidateModule } from '@/common/validate/validate.module';
import { PostOwnerGuard } from '@/post/guard/post-owner.guard';
import { PostRepository } from '@/post/post.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule, ValidateModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostOwnerGuard],
  exports: [PostService, PostRepository],
})
export class PostModule {}
