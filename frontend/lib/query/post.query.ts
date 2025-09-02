import { fetcher } from '@/lib/client'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const POST_LIST_KEY = 'postList'
export const POST_KEY = 'post'
export const POST_COMMENT_KEY = 'postComment'

// Post Get Paging Query
export const postListQueryFn = async ({ page = 0, size = 10 }: PageParams) => {
  const { data } = await fetcher.GET('/post', {
    params: {
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
export const usePostListQuery = (params: PageParams) =>
  useQuery({
    queryKey: [POST_LIST_KEY, params],
    queryFn: () => postListQueryFn(params),
  })

// Post Get Query
export const postQueryFn = async (postId: string) => {
  const { data } = await fetcher.GET('/post/{id}', {
    params: { path: { id: postId } },
  })
  return recursiveDateParse(data)
}
export const usePostQuery = (postId: string) =>
  useQuery({
    queryKey: [POST_KEY, postId],
    queryFn: () => postQueryFn(postId),
  })

// Post Update Query
interface PostPutParams {
  postId: string
}
interface PostPutBody {
  content: string
}
export const postPutQueryFn = async ({ postId, content }: PostPutParams & PostPutBody) => {
  const { data } = await fetcher.PUT('/post/{id}', {
    params: { path: { id: postId } },
    body: { content },
  })
  return data
}
export const usePostPutQuery = () =>
  useMutation({
    mutationFn: (params: PostPutParams & PostPutBody) => postPutQueryFn(params),
  })

// Post Create Query
export const postCreateQueryFn = async (content: string) => {
  const { data } = await fetcher.POST('/post', {
    body: { content },
  })
  return data
}
export const usePostCreateQuery = () =>
  useMutation({
    mutationFn: (content: string) => postCreateQueryFn(content),
  })

// Post Like Query
export const postLikeQueryFn = async (postId: string) => {
  const { data } = await fetcher.POST('/post/{id}/like', {
    params: { path: { id: postId } },
  })
  return data
}
export const usePostLikeQuery = () =>
  useMutation({
    mutationFn: (postId: string) => postLikeQueryFn(postId),
  })

// Post Delete Query
export const postDeleteQueryFn = async (postId: string) => {
  const { data } = await fetcher.DELETE('/post/{id}', {
    params: { path: { id: postId } },
  })
  return data
}
export const usePostDeleteQuery = () =>
  useMutation({
    mutationFn: (postId: string) => postDeleteQueryFn(postId),
  })

// Post Comment Get Paging Query
export const postCommentQueryFn = async (postId: string, { page = 0, size = 10 }: PageParams) => {
  const { data } = await fetcher.GET('/post/{id}/comments', {
    params: {
      path: { id: postId },
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
export const usePostCommentQuery = (postId: string, params: PageParams) =>
  useQuery({
    queryKey: [POST_COMMENT_KEY, postId, params],
    queryFn: () => postCommentQueryFn(postId, params),
  })
