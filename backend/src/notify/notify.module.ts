import { NotifyEventListener } from '@/notify/event/notify.listener';
import { NotifyController } from '@/notify/notify.controller';
import { NotifyRepository } from '@/notify/notify.repository';
import { NotifyService } from '@/notify/notify.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [NotifyController],
  providers: [NotifyService, NotifyRepository, NotifyEventListener],
  exports: [NotifyService, NotifyRepository],
})
export class NotifyModule {}
