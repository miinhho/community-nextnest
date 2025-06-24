import { PrismaModule } from '@/prisma/prisma.module';
import { PrivateController } from '@/private/private.controller';
import { PrivateRepository } from '@/private/private.repository';
import { PrivateService } from '@/private/private.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [PrivateService, PrivateRepository],
  controllers: [PrivateController],
  exports: [PrivateService, PrivateRepository],
})
export class PrivateModule {}
