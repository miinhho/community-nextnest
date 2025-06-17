import { ValidateService } from '@/common/validate/validate.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [ValidateService],
  exports: [ValidateService],
})
export class ValidateModule {}
