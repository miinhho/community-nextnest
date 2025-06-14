import { PageQuery } from '@/common/decorator/page-query.decorator';

export type PageParams = Partial<PageQuery>;

export interface PageMeta extends PageQuery {
  totalPage: number;
  totalCount: number;
}

export interface PageData<T> {
  data: T;
  meta: PageMeta;
}

export const toPageData = <T>({
  data,
  totalCount,
  page = 1,
  size = 10,
}: {
  data: T;
  totalCount: number;
} & PageParams): PageData<T> => {
  return {
    data,
    meta: {
      page,
      size,
      totalPage: Math.ceil(totalCount / size),
      totalCount,
    },
  };
};
