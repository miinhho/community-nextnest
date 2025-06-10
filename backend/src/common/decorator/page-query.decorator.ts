import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PageQuery {
  page: number;
  size: number;
}

export const PageQuery = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PageQuery => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const size = parseInt(request.query.size, 10) || 10;

    return { page, size };
  },
);
