import { PrismaService } from '@/common/database/prisma.service';
import { FollowRepository } from '@/follow/follow.repository';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, PrismaService, FollowRepository],
  exports: [FollowService],
})
export class FollowModule {}
