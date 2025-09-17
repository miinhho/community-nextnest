import { USER_QUERY } from '@/features/user/query/user-key'
import { INITIAL_PAGE } from '@/lib/constant'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useQuery } from '@tanstack/react-query'

// User Comment Get Query
export const userCommentQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const { data } = await fetcher.GET('/user/{id}/comments', {
    params: {
      path: { id: userId },
      query: {
        page,
        size,
      },
    },
  })
  return {
    comments: recursiveDateParse(data?.comments),
    meta: data?.meta,
  }
}
export const useUserCommentQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_QUERY.USER, userId, USER_QUERY.COMMENTS, params],
    queryFn: () => userCommentQueryFn(userId, params),
  })
