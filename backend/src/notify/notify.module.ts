import { NotifyEventListener } from '@/notify/event/notify.listener';
import { NotifyController } from '@/notify/notify.controller';
import { NotifyRepository } from '@/notify/notify.repository';
import { NotifyService } from '@/notify/notify.service';
import { NotifySseController } from '@/notify/sse/notify-sse.controller';
import { NotifySseService } from '@/notify/sse/notify-sse.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [NotifyController, NotifySseController],
  providers: [NotifyService, NotifyRepository, NotifyEventListener, NotifySseService],
  exports: [NotifyService, NotifyRepository],
})
export class NotifyModule {}
