import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/axios'
import { PageParams } from '@/lib/types/page.types'
import { CommentSchema } from '@/lib/types/schema.types'
import { LikeStatus } from '@/lib/types/status.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiError } from 'next/dist/server/api-utils'

export const COMMENT_KEY = 'comment'
export const REPLIES_KEY = 'replies'

// Commment Get Query
interface CommentData extends CommentSchema {
  postId: string
  replies: CommentSchema[]
  parent?: CommentSchema
}
export const commentQueryFn = async (commentId: string) => {
  const response = await apiGet<CommentData>(`comment/${commentId}`)
  return response.data
}
export const useCommentQuery = (commentId: string) =>
  useQuery({
    queryKey: [COMMENT_KEY, commentId],
    queryFn: () => commentQueryFn(commentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// Replies Get Query
interface RepliesData {
  replies: CommentSchema[]
}
export const repliesQueryFn = async (commentId: string, { page = 1, size = 10 }: PageParams) => {
  const response = await apiGet<RepliesData>(
    `comment/${commentId}/replies?page=${page}&size=${size}`,
  )
  return {
    replies: response.data.replies,
    meta: response.meta!,
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
interface CommentCreateData {
  commentId: string
  postId: string
  authorId: string
}
export const commentCreateQueryFn = async (params: CommentCreateBody) => {
  const response = await apiPost<CommentCreateData>('comment', params)
  return response.data
}
export const useCommentCreateQuery = () =>
  useMutation<CommentCreateData, ApiError, CommentCreateBody, unknown>({
    mutationFn: (params) => commentCreateQueryFn(params),
  })

// Reply Create Query
interface ReplyCreateBody {
  postId: string
  content: string
  commentId: string
}
interface ReplyCreateData {
  replyId: string
  postId: string
  authorId: string
}
export const replyCreateQueryFn = async (params: ReplyCreateBody) => {
  const response = await apiPost<ReplyCreateData>('reply', params)
  return response.data
}
export const useReplyCreateQuery = () =>
  useMutation<ReplyCreateData, ApiError, ReplyCreateBody, unknown>({
    mutationFn: (params) => replyCreateQueryFn(params),
  })

// Comment Update Query
interface CommentPutParams {
  commentId: string
}
interface CommentPutBody {
  content: string
}
interface CommentPutData {
  commentId: string
}
export const commentPutQueryFn = async ({
  commentId,
  content,
}: CommentPutParams & CommentPutBody) => {
  const response = await apiPut<CommentPutData>(`comment/${commentId}`, { content })
  return response.data
}
export const useCommentPutQuery = () =>
  useMutation<CommentPutData, ApiError, CommentPutParams & CommentPutBody, unknown>({
    mutationFn: (params: CommentPutParams & CommentPutBody) => commentPutQueryFn(params),
  })

// Comment Delete Query
interface CommentDeleteData {
  postId: string
  content: string
  authorId: string
}
export const commentDeleteQueryFn = async (commentId: string) => {
  const response = await apiDelete<CommentDeleteData>(`comment/${commentId}`)
  return response.data
}
export const useCommentDeleteQuery = () =>
  useMutation<CommentDeleteData, ApiError, string, unknown>({
    mutationFn: (commentId: string) => commentDeleteQueryFn(commentId),
  })

// Comment Like Query
interface CommentLikeData {
  id: string
  status: LikeStatus
}
export const commentLikeQueryFn = async (commentId: string) => {
  const response = await apiPost<CommentLikeData>(`comment/${commentId}/like`)
  return response.data
}
export const useCommentLikeQuery = () =>
  useMutation<CommentLikeData, ApiError, string, unknown>({
    mutationFn: (commentId: string) => commentLikeQueryFn(commentId),
  })
