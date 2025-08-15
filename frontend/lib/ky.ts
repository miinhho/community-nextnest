import { HttpStatus } from '@/lib/status'
import { PageParams } from '@/lib/types/page.types'
import ky, { type Options } from 'ky'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
  meta?: PageParams
}

const fetcher = ky.create({
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  credentials: 'include',
  retry: {
    limit: 3,
    statusCodes: [HttpStatus.Unauthorized],
    methods: ['get', 'post', 'put', 'delete', 'patch'],
  },
  hooks: {
    beforeRetry: [
      // 재시도 전 Refresh Token 갱신
      async () => {
        await ky
          .post('/api/auth/refresh', {
            credentials: 'include',
            retry: { limit: 0 },
          })
          .catch(() => {
            window.location.href = '/login'
          })
      },
    ],
  },
})

export const apiGet = <T = any>(url: string, options?: Options) =>
  fetcher.get<ApiResponse<T>>(url, options).json()

export const apiPost = <T = any>(url: string, body?: any, options?: Options) =>
  fetcher
    .post<ApiResponse<T>>(url, {
      json: body,
      ...options,
    })
    .json()

export const apiPut = <T = any>(url: string, body?: any, options?: Options) =>
  fetcher
    .put<ApiResponse<T>>(url, {
      json: body,
      ...options,
    })
    .json()

export const apiDelete = <T = any>(url: string, options?: Options) =>
  fetcher.delete<ApiResponse<T>>(url, options).json()

export const apiPatch = <T = any>(url: string, body?: any, options?: Options) =>
  fetcher
    .patch<ApiResponse<T>>(url, {
      json: body,
      ...options,
    })
    .json()
