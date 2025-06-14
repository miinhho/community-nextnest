import { PrismaService } from '@/common/database/prisma.service';
import { FollowRepository } from '@/follow/follow.repository';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, PrismaService, FollowRepository, UserService],
  exports: [FollowService],
})
export class FollowModule {}
