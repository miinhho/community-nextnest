/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ApiError } from '@/lib/error/api-error'
import { PageMeta } from '@/lib/types/page.types'
import { recursiveDateParse } from '@/lib/utils/parsing'
import axios, { AxiosResponse, HttpStatusCode } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

interface ApiResponse<T = any, D = any> extends AxiosResponse<T, D> {
  success: boolean
  message?: string
  error?: string
  meta?: PageMeta
}

export const fetcher = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
})

const refreshAuthLogic = async () => {
  await axios.post(
    'api/auth/refresh',
    {},
    {
      withCredentials: true,
    },
  )
  return Promise.resolve()
}

createAuthRefreshInterceptor(fetcher, refreshAuthLogic)

fetcher.interceptors.response.use(
  (response) => {
    response.data = recursiveDateParse(response.data)
    return response
  },
  async (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    switch (status) {
      case HttpStatusCode.Unauthorized:
        throw new ApiError(401, message || '로그인이 필요합니다', error.response?.data)
      case HttpStatusCode.Forbidden:
        throw new ApiError(403, message || '접근 권한이 없습니다', error.response?.data)
      case HttpStatusCode.NotFound:
        throw new ApiError(404, message || '요청한 리소스를 찾을 수 없습니다', error.response?.data)
      case HttpStatusCode.InternalServerError:
        throw new ApiError(500, message || '서버 내부 오류가 발생했습니다', error.response?.data)
      default:
        throw new ApiError(status || 0, message, error.response?.data)
    }
  },
)

export const apiGet = <T>(url: string) => fetcher.get<T, ApiResponse<T>>(url)
export const apiPost = <T>(url: string, data?: any) => fetcher.post<T, ApiResponse<T>>(url, data)
export const apiDelete = <T>(url: string) => fetcher.delete<T, ApiResponse<T>>(url)
export const apiPut = <T>(url: string, data?: any) => fetcher.put<T, ApiResponse<T>>(url, data)
export const apiPatch = <T>(url: string, data?: any) => fetcher.patch<T, ApiResponse<T>>(url, data)
