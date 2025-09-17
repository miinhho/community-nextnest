import { POST_QUERY } from '@/features/post/query/post-key'
import { fetcher } from '@/lib/fetch'
import { recursiveDateParse } from '@/lib/utils/parsing'
import { PageParams } from '@/types/page.types'
import { useQuery } from '@tanstack/react-query'

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
    meta: data?.meta,
  }
}
export const usePostCommentQuery = (postId: string, params: PageParams) =>
  useQuery({
    queryKey: [POST_QUERY.COMMENT, postId, params],
    queryFn: () => postCommentQueryFn(postId, params),
  })
