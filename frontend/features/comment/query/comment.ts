import { COMMENT_QUERY } from '@/features/comment/query/comment-key'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { useMutation, useQuery } from '@tanstack/react-query'

// Commment Get Query
export const commentGetQueryFn = async (commentId: string) => {
  const { data } = await fetcher.GET('/comment/{id}', {
    params: { path: { id: commentId } },
  })
  return recursiveDateParse(data)
}
export const useCommentGetQuery = (commentId: string) =>
  useQuery({
    queryKey: [COMMENT_QUERY.COMMENT, commentId],
    queryFn: () => commentGetQueryFn(commentId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// Comment Post Query
interface CommentPostBody {
  postId: string
  content: string
}
export const commentPostQueryFn = async (params: CommentPostBody) => {
  const { data } = await fetcher.POST('/comment', {
    body: params,
  })
  return data
}
export const useCommentPostQuery = () =>
  useMutation({
    mutationFn: (params: CommentPostBody) => commentPostQueryFn(params),
  })

// Comment Put Query
interface CommentPutBody {
  commentId: string
  content: string
}
export const commentPutQueryFn = async (params: CommentPutBody) => {
  const { data } = await fetcher.PUT('/comment', {
    body: params,
  })
  return data
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
  return data
}
export const useCommentDeleteQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentDeleteQueryFn(commentId),
  })
