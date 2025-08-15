import { HttpStatus } from '@/lib/status'
import { HTTPError } from 'ky'

export const handleApiError = (error: unknown) => {
  if (error instanceof HTTPError) {
    switch (error.response.status) {
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
  } else {
    window.location.href = '/error?code=unknown'
  }
}
