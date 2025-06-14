import { isAdmin } from '@/common/user';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
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

export function Admin() {
  return UseGuards(AdminGuard);
}
