import { apiErrorMiddleware, tokenRefreshMiddleware } from '@/lib/client-middleware'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api-types'

export const fetcher = createClient<paths>({
  baseUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})

fetcher.use(tokenRefreshMiddleware)
fetcher.use(apiErrorMiddleware)
