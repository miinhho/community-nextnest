import { USER_QUERY } from '@/features/user/query/user-key'
import { INITIAL_PAGE } from '@/lib/constant'
import { fetcher } from '@/lib/fetch'
import { PageParams } from '@/types/page.types'
import { useQuery } from '@tanstack/react-query'

// User Followers Get Query
export const userFollowersQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const { data } = await fetcher.GET('/user/{id}/followers', {
    params: {
      path: { id: userId },
      query: {
        page,
        size,
      },
    },
  })
  return {
    followers: data?.followers,
    meta: data?.meta,
  }
}
export const useUserFollowersQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_QUERY.USER, userId, USER_QUERY.FOLLOWERS, params],
    queryFn: () => userFollowersQueryFn(userId, params),
  })

// User Following Get Query
export const userFollowingQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const { data } = await fetcher.GET('/user/{id}/following', {
    params: {
      path: { id: userId },
      query: {
        page,
        size,
      },
    },
  })
  return {
    following: data?.following,
    meta: data?.meta,
  }
}
export const useUserFollowingQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_QUERY.USER, userId, USER_QUERY.FOLLOWING, params],
    queryFn: () => userFollowingQueryFn(userId, params),
  })
