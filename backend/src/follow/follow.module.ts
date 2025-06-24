import { ValidateModule } from '@/common/validate/validate.module';
import { FollowRepository } from '@/follow/follow.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrivateModule } from '@/private/private.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [PrismaModule, ValidateModule, PrivateModule],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
