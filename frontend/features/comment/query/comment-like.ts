import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Comment Like Query
export const commentLikeQueryFn = async (commentId: string) => {
  const { data } = await fetcher.POST('/comment/{id}/like', {
    params: { path: { id: commentId } },
  })
  return data
}
export const useCommentLikeQuery = () =>
  useMutation({
    mutationFn: (commentId: string) => commentLikeQueryFn(commentId),
  })
