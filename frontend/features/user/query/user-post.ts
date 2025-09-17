import { USER_QUERY } from '@/features/user/query/user-key'
import { INITIAL_PAGE } from '@/lib/constant'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useQuery } from '@tanstack/react-query'

// User Post Get Query
export const userPostQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const { data } = await fetcher.GET('/user/{id}/posts', {
    params: {
      path: { id: userId },
      query: {
        page,
        size,
      },
    },
  })
  return {
    posts: recursiveDateParse(data?.posts),
    meta: data?.meta,
  }
}
export const useUserPostQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_QUERY.USER, userId, USER_QUERY.POSTS, params],
    queryFn: () => userPostQueryFn(userId, params),
  })
