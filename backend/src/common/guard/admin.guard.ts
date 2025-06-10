import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    throw new ForbiddenException('관리자 권한이 필요합니다.');
  }
}
