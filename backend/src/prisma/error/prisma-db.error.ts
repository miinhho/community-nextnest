import { InternalServerErrorException } from '@nestjs/common';

/**
 * Prisma 데이터베이스 관련 오류를 처리하기 위한 예외 클래스입니다.
 *
 * InternalServerErrorException을 상속받아 HTTP 500 상태 코드를 반환합니다.
 */
export class PrismaDBError extends InternalServerErrorException {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}
