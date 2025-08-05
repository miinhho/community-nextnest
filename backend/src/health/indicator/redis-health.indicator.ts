import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  /**
   * Redis 헬스 체크를 수행합니다.
   */
  async pingCheck(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    const pingResult = await this.redis.ping();
    return pingResult === 'PONG' ? indicator.up() : indicator.down();
  }
}
