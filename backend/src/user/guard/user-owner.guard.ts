import { isAdmin } from '@/common/user';
import { CanActivate, ForbiddenException, UseGuards } from '@nestjs/common';
import { Request } from 'express';

export class UserOwnerGuard implements CanActivate {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;
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

export function UserOwner() {
  return UseGuards(UserOwnerGuard);
}
