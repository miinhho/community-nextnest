import { ValidateService } from '@/common/validate/validate.service';
import { FollowRepository } from '@/follow/follow.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [PrismaModule],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository, ValidateService],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
