'use client'

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
    Accept: 'application/json',
  },
  timeout: 5000,
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 403) {
          await ky('/auth/refresh')
          return ky(request)
        }
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
