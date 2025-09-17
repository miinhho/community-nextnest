import { fetcher } from '@/lib/fetch'
import { useMutation } from '@tanstack/react-query'

// Auth Register Query
export interface AuthRegisterBody {
  email: string
  password: string
  name: string
}
export const authRegisterQueryFn = async (params: AuthRegisterBody) => {
  const { data } = await fetcher.POST('/auth/register', {
    body: params,
  })
  return data
}
export const useAuthRegisterQuery = () =>
  useMutation({
    mutationFn: (params: AuthRegisterBody) => authRegisterQueryFn(params),
  })
