import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Follow Toggle Query
export const followQueryFn = async (targetId: string) => {
  const { data } = await fetcher.POST('/user/{id}/follow', {
    params: {
      path: { id: targetId },
    },
  })
  return data
}
export const useFollowQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followQueryFn(targetId),
  })
