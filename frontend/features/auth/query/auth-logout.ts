import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Auth Logout Query
export const authLogoutQueryFn = async () => {
  await fetcher.POST('/auth/logout')
}
export const useAuthLogoutQuery = () =>
  useMutation({
    mutationFn: () => authLogoutQueryFn(),
  })
