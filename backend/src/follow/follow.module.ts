import { BlockModule } from '@/block/block.module';
import { FollowRepository } from '@/follow/follow.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrivateModule } from '@/private/private.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [PrismaModule, PrivateModule, BlockModule],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
