import { OwnerGuard } from '@/common/guard/owner.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function Owner() {
  return applyDecorators(UseGuards(OwnerGuard));
}
