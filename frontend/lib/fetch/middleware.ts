import { HttpStatus } from '@/lib/constants/http-status'
import { Middleware } from 'openapi-fetch'

export const tokenRefreshMiddleware: Middleware = {
  async onResponse({ response, request }) {
    if (response.status === HttpStatus.Unauthorized) {
      try {
        await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        return fetch(request)
      } catch (err) {
        window.location.href = '/login'
        throw err
      }
    }
  },
}

export const apiErrorMiddleware: Middleware = {
  onResponse({ response }) {
    if (!response.ok) {
      switch (response.status) {
        case HttpStatus.Unauthorized:
          window.location.href = '/login'
          break
        case HttpStatus.Forbidden:
          window.location.href = '/error?code=403'
          break
        case HttpStatus.NotFound:
          window.location.href = '/error?code=404'
          break
        case HttpStatus.InternalServerError:
          window.location.href = '/error?code=500'
          break
        default:
          window.location.href = '/error?code=unknown'
      }
    }
  },
}
