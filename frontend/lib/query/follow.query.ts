import { fetcher } from '@/lib/client'
import { useMutation } from '@tanstack/react-query'

// Follow Toggle Query
export const followQueryFn = async (targetId: string) => {
  const { data } = await fetcher.POST('/user/{id}/follow', {
    params: {
      path: { id: targetId },
    },
  })
  return data?.data
}
export const useFollowQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followQueryFn(targetId),
  })

// Follow Request Send Query
export const followRequestQueryFn = async (targetId: string) => {
  const { data } = await fetcher.POST('/user/{id}/follow/request', {
    params: { path: { id: targetId } },
  })
  return data?.data
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
  return data?.data
}
export const useFollowRequestRejectQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followRequestRejectQueryFn(targetId),
  })
