export const PaginationMetaSchema = {
  type: 'object',
  properties: {
    totalCount: { type: 'number', description: '전체 항목 수' },
    pageCount: { type: 'number', description: '전체 페이지 수' },
    currentPage: { type: 'number', description: '현재 페이지' },
    pageSize: { type: 'number', description: '페이지당 항목 수' },
  },
  required: ['totalCount', 'pageCount', 'currentPage', 'pageSize'],
};
