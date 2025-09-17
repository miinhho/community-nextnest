import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Auth token refresh Query
export const authRefreshQueryFn = async () => {
  await fetcher.POST('/auth/refresh')
}
export const useAuthRefreshQuery = () =>
  useMutation({
    mutationFn: () => authRefreshQueryFn(),
  })
