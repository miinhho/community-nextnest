import { PrismaService } from '@/common/database/prisma.service';
import { ValidateService } from '@/common/validate/validate.service';
import { FollowRepository } from '@/follow/follow.repository';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FollowRepository, PrismaService, ValidateService],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
