import { ApiError } from '@/lib/error/api-error'
import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
