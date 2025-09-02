import { fetcher } from '@/lib/client'
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

// Auth Logout Query
export const authLogoutQueryFn = async () => {
  await fetcher.POST('/auth/logout')
}
export const useAuthLogoutQuery = () =>
  useMutation({
    mutationFn: () => authLogoutQueryFn(),
  })

// Auth token refresh Query
export const authRefreshQueryFn = async () => {
  await fetcher.POST('/auth/refresh')
}
export const useAuthRefreshQuery = () =>
  useMutation({
    mutationFn: () => authRefreshQueryFn(),
  })
