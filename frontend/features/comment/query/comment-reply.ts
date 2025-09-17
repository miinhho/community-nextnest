import { COMMENT_QUERY } from '@/features/comment/query/comment-key'
import { INITIAL_PAGE } from '@/lib/constant'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useMutation, useQuery } from '@tanstack/react-query'

// Replies Get Query
export const repliesGetQueryFn = async (
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
    replies: recursiveDateParse(data?.replies),
    meta: data?.meta,
  }
}
export const useRepliesQuery = (commentId: string, params: PageParams) =>
  useQuery({
    queryKey: [COMMENT_QUERY.REPLIES, commentId, params],
    queryFn: () => repliesGetQueryFn(commentId, params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

// Reply Create Query
interface ReplyPostBody {
  postId: string
  content: string
  commentId: string
}
export const replyPostQueryFn = async (params: ReplyPostBody) => {
  const { data } = await fetcher.POST('/reply', {
    body: params,
  })
  return data
}
export const useReplyCreateQuery = () =>
  useMutation({
    mutationFn: (params: ReplyPostBody) => replyPostQueryFn(params),
  })
