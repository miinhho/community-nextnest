import { apiDelete, apiPost } from '@/lib/axios'
import { FollowStatus } from '@/lib/types/status.types'
import { useMutation } from '@tanstack/react-query'

// Follow Toggle Query
interface FollowData {
  status: FollowStatus
  targetId: string
}
export const followQueryFn = async (targetId: string) => {
  const response = await apiPost<FollowData>(`user/${targetId}/follow`)
  return response.data
}
export const useFollowQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followQueryFn(targetId),
  })

// Follow Request Send Query
interface FollowRequestData {
  targetId: string
}
export const followRequestQueryFn = async (targetId: string) => {
  const response = await apiPost<FollowRequestData>(`user/${targetId}/follow/request`)
  return response.data
}
export const useFollowRequestQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followRequestQueryFn(targetId),
  })

// Follow Request Reject Query
interface FollowRequestRejectData {
  targetId: string
}
export const followRequestRejectQueryFn = async (targetId: string) => {
  const response = await apiDelete<FollowRequestRejectData>(`user/${targetId}/follow/request`)
  return response.data
}
export const useFollowRequestRejectQuery = () =>
  useMutation({
    mutationFn: (targetId: string) => followRequestRejectQueryFn(targetId),
  })
