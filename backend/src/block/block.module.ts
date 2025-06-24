import { BlockController } from '@/block/block.controller';
import { BlockRepository } from '@/block/block.repository';
import { BlockService } from '@/block/block.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [BlockController],
  providers: [BlockService, BlockRepository],
  exports: [BlockService, BlockRepository],
})
export class BlockModule {}
