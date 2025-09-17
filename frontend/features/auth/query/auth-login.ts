import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Auth Login Query
export interface AuthLoginBody {
  email: string
  password: string
}
export const authLoginQueryFn = async (params: AuthLoginBody) => {
  const { data } = await fetcher.POST('/auth/login', {
    body: params,
  })
  return data
}
export const useAuthLoginQuery = () =>
  useMutation({
    mutationFn: (params: AuthLoginBody) => authLoginQueryFn(params),
  })
