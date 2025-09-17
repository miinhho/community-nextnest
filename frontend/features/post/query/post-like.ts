import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

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
