import { Public } from '@/common/decorator/public.decorator';
import { ApiHealthCheckTags } from '@/common/swagger/tags.swagger';
import redisConfig from '@/config/redis.config';
import { ApiCheck } from '@/health/health.swagger';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import Redis from 'ioredis';

@Controller('health')
@ApiHealthCheckTags()
export class HealthController {
  private readonly redis: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisSetting: ConfigType<typeof redisConfig>,
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redisHealth: RedisHealthIndicator,
  ) {
    this.redis = new Redis(this.redisSetting.url);
  }

  @Get()
  @Public()
  @HealthCheck()
  @ApiCheck()
  check() {
    return this.health.check([
      async () => this.prismaHealth.pingCheck('database', this.prisma),
      async () =>
        this.redisHealth.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
          timeout: 500,
        }),
    ]);
  }
}
