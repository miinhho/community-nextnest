import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = (request as Request).user;

    if (user && user.role === Role.ADMIN) {
      return true;
    }

    return false;
  }
}
