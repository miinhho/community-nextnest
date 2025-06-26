import { NotifyController } from '@/notify/notify.controller';
import { NotifyRepository } from '@/notify/notify.repository';
import { NofifyService } from '@/notify/notify.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [NotifyController],
  providers: [NofifyService, NotifyRepository],
  exports: [NofifyService, NotifyRepository],
})
export class NotifyModule {}
