import { isAdmin } from '@/common/user';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * 관리자 권한을 확인하는 Guard 클래스
 *
 * 로그인된 사용자가 관리자 권한을 가지고 있는지 검증합니다.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  /**
   * 관리자 권한을 확인합니다.
   *
   * @param context - NestJS 실행 컨텍스트
   * @returns 접근 허용 여부
   * @throws {ForbiddenException} 로그인이 필요하거나 관리자 권한이 없는 경우
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    if (isAdmin(user)) {
      return true;
    }

    throw new ForbiddenException('관리자 권한이 필요합니다.');
  }
}

/**
 * 관리자 권한 확인을 위한 데코레이터 함수
 *
 * 컨트롤러 메서드나 클래스에 적용하여 관리자만 접근할 수 있도록 제한합니다.
 *
 * @returns UseGuards 데코레이터
 *
 * @example
 * ```typescript
 * ＠Admin()
 * ＠Delete(':id')
 * async deleteUser(＠Param('id') id: string) {
 *   // 관리자만 접근 가능
 * }
 * ```
 */
export function Admin() {
  return UseGuards(AdminGuard);
}
