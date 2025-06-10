import { AdminGuard } from '@/common/guard/admin.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function Admin() {
  return applyDecorators(UseGuards(AdminGuard));
}
