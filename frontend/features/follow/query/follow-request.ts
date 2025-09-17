import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Follow Request Send Query
export const followRequestQueryFn = async (targetId: string) => {
  const { data } = await fetcher.POST('/user/{id}/follow/request', {
    params: { path: { id: targetId } },
  })
  return data
}
export const useFollowRequestQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followRequestQueryFn(targetId),
  })

// Follow Request Reject Query
export const followRequestRejectQueryFn = async (targetId: string) => {
  const { data } = await fetcher.DELETE('/user/{id}/follow/request', {
    params: { path: { id: targetId } },
  })
  return data
}
export const useFollowRequestRejectQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followRequestRejectQueryFn(targetId),
  })
