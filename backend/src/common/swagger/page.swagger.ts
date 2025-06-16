import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const pageMetaSchema = {
  type: 'object',
  properties: {
    totalCount: { type: 'number', description: '전체 항목 수' },
    pageCount: { type: 'number', description: '전체 페이지 수' },
    currentPage: { type: 'number', description: '현재 페이지' },
    pageSize: { type: 'number', description: '페이지당 항목 수' },
  },
  required: ['totalCount', 'pageCount', 'currentPage', 'pageSize'],
};

export const PageSwaggerQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      type: 'integer',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 수 (기본값: 10)',
      type: 'integer',
      example: 10,
    }),
  );
