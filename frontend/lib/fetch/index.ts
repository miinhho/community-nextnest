import { apiErrorMiddleware, tokenRefreshMiddleware } from '@/lib/fetch/middleware'
import type { paths } from '@/types/api-types'
import createClient from 'openapi-fetch'

export const fetcher = createClient<paths>({
  baseUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})

fetcher.use(tokenRefreshMiddleware)
fetcher.use(apiErrorMiddleware)
