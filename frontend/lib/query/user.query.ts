import { apiGet, apiPatch } from '@/lib/axios'
import { INITIAL_PAGE } from '@/lib/constant'
import { PageParams } from '@/lib/types/page.types'
import { BaseTimestamp, CommentSchema, PostSchema, UserSchema } from '@/lib/types/schema.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type ApiError } from 'next/dist/server/api-utils'

export const USER_KEY = 'user'
export const USER_POSTS_KEY = 'userPosts'
export const USER_COMMENTS_KEY = 'userComments'
export const FOLLOWER_KEY = 'followers'
export const FOLLOWING_KEY = 'following'

// User Get Query
export interface UserData extends UserSchema, BaseTimestamp {
  followersCount: number
  followingCount: number
  postCount: number
  role: string
  email: string
  emailVerified: Date | null
}
export const userQueryFn = async (userId: string) => {
  const response = await apiGet<UserData>(`user/${userId}`)
  return response.data
}
export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: [USER_KEY, userId],
    queryFn: () => userQueryFn(userId),
  })

// User Followers Get Query
interface UserFollowersData {
  followers: UserSchema[]
}
export const userFollowersQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const response = await apiGet<UserFollowersData>(
    `user/${userId}/followers?page=${page}&size=${size}`,
  )
  return {
    followers: response.data.followers,
    meta: response.meta!,
  }
}
export const useUserFollowersQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, FOLLOWER_KEY, params],
    queryFn: () => userFollowersQueryFn(userId, params),
  })

// User Following Get Query
interface UserFollowingData {
  following: UserSchema[]
}
export const userFollowingQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const response = await apiGet<UserFollowingData>(
    `user/${userId}/following?page=${page}&size=${size}`,
  )
  return {
    following: response.data.following,
    meta: response.meta!,
  }
}
export const useUserFollowingQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, FOLLOWING_KEY, params],
    queryFn: () => userFollowingQueryFn(userId, params),
  })

// User Post Get Query
interface UserPostData {
  posts: Omit<PostSchema, 'author'>[]
}
export const userPostQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const response = await apiGet<UserPostData>(`user/${userId}/posts?page=${page}&size=${size}`)
  return {
    posts: response.data.posts,
    meta: response.meta!,
  }
}
export const useUserPostQuery = (userId: string, params: PageParams) =>
  useQuery({
    queryKey: [USER_KEY, userId, USER_POSTS_KEY, params],
    queryFn: () => userPostQueryFn(userId, params),
  })

// User Comment Get Query
interface UserCommentData {
  comments: CommentSchema & { post: Omit<PostSchema, 'author'> }[]
}
export const userCommentQueryFn = async (
  userId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const response = await apiGet<UserCommentData>(
    `user/${userId}/comments?page=${page}&size=${size}`,
  )
  return {
    comments: response.data.comments,
    meta: response.meta!,
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
  const response = await apiPatch<UserData>(`user/${userId}`, {
    image,
    name,
  })
  return response.data
}
export const useUserPatchQuery = () =>
  useMutation<UserData, ApiError, UserPatchParams, unknown>({
    mutationFn: (params) => userPatchQueryFn(params),
  })

// User Delete Query
interface UserDeleteData {
  id: string
  name: string
  image: string | null
  email: string
}
export const userDeleteQueryFn = async (userId: string) => {
  const response = await apiGet<UserDeleteData>(`user/${userId}/delete`)
  return response.data
}
export const useUserDeleteQuery = () =>
  useMutation<UserDeleteData, ApiError, string, unknown>({
    mutationFn: (userId) => userDeleteQueryFn(userId),
  })
