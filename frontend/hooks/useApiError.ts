import { ApiError } from '@/lib/error/api-error'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * API 에러를 처리하는 훅
 *
 * 에러의 상태 코드에 따라 적절한 페이지로 리다이렉트합니다.
 */
export const useApiError = () => {
  const router = useRouter()

  const handleApiError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            alert(error.message)
            router.push('/login')
            break
          case 403:
            router.push('/error?code=403')
            break
          case 404:
            router.push('/error?code=404')
            break
          case 500:
            router.push('/error?code=500')
            break
          default:
            router.push('/error?code=unknown')
        }
      } else {
        router.push('/error?code=unknown')
      }
    },
    [router],
  )

  return { handleApiError }
}
