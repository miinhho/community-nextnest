export interface PageMeta {
  page: number;
  size: number;
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
  page: number;
  size: number;
}): PageData<T> => {
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
