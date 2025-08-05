import { HealthController } from '@/health/health.controller';
import { RedisHealthIndicator } from '@/health/indicator/redis-health.indicator';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
