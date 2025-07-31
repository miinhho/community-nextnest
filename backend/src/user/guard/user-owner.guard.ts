import { isAdmin, UserData } from '@/common/user';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';

/**
 * 리소스에 대한 접근 권한을 확인하여 본인 또는 관리자만 접근할 수 있도록 제한합니다.
 *
 * @implements {CanActivate}
 */
export class UserOwnerGuard implements CanActivate {
  /**
   * 요청된 리소스에 대한 접근 권한을 확인합니다.
   *
   * 로그인된 사용자가 관리자이거나 리소스의 소유자인 경우에만 접근을 허용합니다.
   *
   * @param {ExecutionContext} context - NestJS 실행 컨텍스트 객체
   * @throws {ForbiddenException} 로그인하지 않은 경우 - "로그인이 필요합니다."
   * @throws {ForbiddenException} 권한이 없는 경우 - "권한이 없습니다."
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserData = request.user;
    const resourceId = request.params.id;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    if (isAdmin(user) || user.id === resourceId) {
      return true;
    }

    throw new ForbiddenException('권한이 없습니다.');
  }
}

/**
 * 사용자 소유권 검증을 활성화합니다.
 *
 *
 * @example
 * ```
 * // 특정 사용자 정보 조회 (본인 또는 관리자만 가능)
 * ＠UserOwner()
 * ＠Get(':id')
 * getUserProfile(＠Param('id') id: string) {
 *   return this.userService.getUserProfile(id);
 * }
 *
 * // 사용자 정보 수정 (본인 또는 관리자만 가능)
 * ＠UserOwner()
 * ＠Put(':id')
 * updateUser(＠Param('id') id: string, ＠Body() updateUserDto: UpdateUserDto) {
 *   return this.userService.update(id, updateUserDto);
 * }
 * ```
 */
export const UserOwner = () => UseGuards(UserOwnerGuard);
