import { fetcher } from '@/lib/client'
import { INITIAL_PAGE } from '@/lib/constant'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const USER_KEY = 'user'
export const USER_POSTS_KEY = 'userPosts'
export const USER_COMMENTS_KEY = 'userComments'
export const FOLLOWER_KEY = 'followers'
export const FOLLOWING_KEY = 'following'

// User Get Query
export const userQueryFn = async (userId: string) => {
  const { data } = await fetcher.GET('/user/{id}', {
    params: { path: { id: userId } },
  })
  return recursiveDateParse(data)
}
export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: [USER_KEY, userId],
    queryFn: () => userQueryFn(userId),
  })

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
    meta: data?.meta!,
  }
}
export const useUserFollowersQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, FOLLOWER_KEY, params],
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
    meta: data?.meta!,
  }
}
export const useUserFollowingQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, FOLLOWING_KEY, params],
    queryFn: () => userFollowingQueryFn(userId, params),
  })

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
    meta: data?.meta!,
  }
}
export const useUserPostQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, USER_POSTS_KEY, params],
    queryFn: () => userPostQueryFn(userId, params),
  })

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
    meta: data?.meta!,
  }
}
export const useUserCommentQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, USER_COMMENTS_KEY, params],
    queryFn: () => userCommentQueryFn(userId, params),
  })

// User Patch Query
interface UserPatchParams {
  userId: string
  name: string
  image: string
}
export const userPatchQueryFn = async ({ userId, name, image }: UserPatchParams) => {
  await fetcher.PATCH('/user/{id}', {
    params: { path: { id: userId } },
    body: { name, image },
  })
}
export const useUserPatchQuery = () =>
  useMutation({
    mutationFn: (params: UserPatchParams) => userPatchQueryFn(params),
  })

// User Delete Query
export const userDeleteQueryFn = async (userId: string) => {
  const { data } = await fetcher.DELETE('/user/{id}', {
    params: { path: { id: userId } },
  })
  return data
}
export const useUserDeleteQuery = () =>
  useMutation({
    mutationFn: (userId: string) => userDeleteQueryFn(userId),
  })
