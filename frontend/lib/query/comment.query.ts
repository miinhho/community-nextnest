import { fetcher } from '@/lib/client'
import { INITIAL_PAGE } from '@/lib/constant'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const COMMENT_KEY = 'comment'
export const REPLIES_KEY = 'replies'

// Commment Get Query
export const commentQueryFn = async (commentId: string) => {
  const { data } = await fetcher.GET('/comment/{id}', {
    params: { path: { id: commentId } },
  })
  return recursiveDateParse(data?.data)
}
export const useCommentQuery = (commentId: string) =>
  useQuery({
    queryKey: [COMMENT_KEY, commentId],
    queryFn: () => commentQueryFn(commentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// Replies Get Query
export const repliesQueryFn = async (
  commentId: string,
  { page, size }: PageParams = INITIAL_PAGE,
) => {
  const { data } = await fetcher.GET('/comment/{id}/replies', {
    params: {
      path: {
        id: commentId,
      },
      query: {
        page,
        size,
      },
    },
  })
  return {
    replies: recursiveDateParse(data?.data?.replies),
    meta: data?.meta,
  }
}
export const useRepliesQuery = (commentId: string, params: PageParams) =>
  useQuery({
    queryKey: [REPLIES_KEY, commentId, params],
    queryFn: () => repliesQueryFn(commentId, params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

// Comment Create Query
interface CommentCreateBody {
  postId: string
  content: string
}
export const commentCreateQueryFn = async (params: CommentCreateBody) => {
  const { data } = await fetcher.POST('/comment', {
    body: params,
  })
  return data?.data
}
export const useCommentCreateQuery = () =>
  useMutation({
    mutationFn: (params: CommentCreateBody) => commentCreateQueryFn(params),
  })

// Reply Create Query
interface ReplyCreateBody {
  postId: string
  content: string
  commentId: string
}
export const replyCreateQueryFn = async (params: ReplyCreateBody) => {
  const { data } = await fetcher.POST('/reply', {
    body: params,
  })
  return data?.data
}
export const useReplyCreateQuery = () =>
  useMutation({
    mutationFn: (params: ReplyCreateBody) => replyCreateQueryFn(params),
  })

// Comment Update Query
interface CommentPutBody {
  commentId: string
  content: string
}
export const commentPutQueryFn = async (params: CommentPutBody) => {
  const { data } = await fetcher.PUT('/comment', {
    body: params,
  })
  return data?.data
}
export const useCommentPutQuery = () =>
  useMutation({
    mutationFn: (params: CommentPutBody) => commentPutQueryFn(params),
  })

// Comment Delete Query
export const commentDeleteQueryFn = async (commentId: string) => {
  const { data } = await fetcher.DELETE('/comment/{id}', {
    params: { path: { id: commentId } },
  })
  return data?.data
}
export const useCommentDeleteQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentDeleteQueryFn(commentId),
  })

// Comment Like Query
export const commentLikeQueryFn = async (commentId: string) => {
  const { data } = await fetcher.POST('/comment/{id}/like', {
    params: { path: { id: commentId } },
  })
  return data?.data
}
export const useCommentLikeQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentLikeQueryFn(commentId),
  })
