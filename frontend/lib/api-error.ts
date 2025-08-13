import { HttpStatus } from '@/lib/status'
import { HTTPError } from 'ky'
import { redirect } from 'next/navigation'

export const handleApiError = (error: unknown) => {
  if (error instanceof HTTPError) {
    switch (error.response.status) {
      case HttpStatus.Unauthorized:
        redirect('/login')
      case HttpStatus.Forbidden:
        redirect('/error?code=403')
      case HttpStatus.NotFound:
        redirect('/error?code=404')
      case HttpStatus.InternalServerError:
        redirect('/error?code=500')
      default:
        redirect('/error?code=unknown')
    }
  } else {
    redirect('/error?code=unknown')
  }
}
