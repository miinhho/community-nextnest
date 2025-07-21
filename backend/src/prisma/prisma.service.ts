import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * NestJS 모듈 초기화 시 데이터베이스 연결을 자동으로 설정합니다.
 *
 * 애플리케이션 종료 시 연결을 안전하게 해제합니다.
 */
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * 모듈 초기화 시 데이터베이스에 연결합니다.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * 모듈 종료 시 데이터베이스 연결을 해제합니다.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
