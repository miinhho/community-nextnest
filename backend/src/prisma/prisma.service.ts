import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 데이터베이스 클라이언트를 관리하는 Service 클래스
 *
 * NestJS 모듈 초기화 시 데이터베이스 연결을 자동으로 설정합니다.
 * 애플리케이션 종료 시 연결을 안전하게 해제합니다.
 */
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * 모듈 초기화 시 데이터베이스에 연결합니다.
   *
   * @throws {Error} 데이터베이스 연결 실패 시
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * 모듈 종료 시 데이터베이스 연결을 해제합니다.
   *
   * @throws {Error} 데이터베이스 연결 해제 실패 시
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
