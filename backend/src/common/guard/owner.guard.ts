import { isAdmin } from '@/common/user';
import { CanActivate, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

export class OwnerGuard implements CanActivate {
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

    throw new ForbiddenException('자신의 계정만 접근할 수 있습니다.');
  }
}
