import { Public } from '@/common/decorator/public.decorator';
import { ApiHealthCheckTags } from '@/common/swagger/tags.swagger';
import { ApiCheck } from '@/health/health.swagger';
import { RedisHealthIndicator } from '@/health/indicator/redis-health.indicator';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiHealthCheckTags()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiCheck()
  check() {
    return this.health.check([
      async () => this.prismaHealth.pingCheck('database', this.prisma),
      async () => this.redisIndicator.pingCheck('redis'),
    ]);
  }
}
