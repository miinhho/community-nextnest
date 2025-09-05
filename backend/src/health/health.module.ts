import { HealthController } from '@/health/health.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, PrismaModule, RedisHealthModule],
  controllers: [HealthController],
})
export class HealthModule {}
