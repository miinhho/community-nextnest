import { useApiError } from '@/hooks/useApiError'
import { useUserStore } from '@/hooks/useUserStore'
import { ApiError } from '@/lib/error/api-error'

/**
 * 사용자 정보를 가져오는 훅
 *
 * 사용자가 로그인되어 있지 않거나 사용자 정보가 없는 경우, 초기화 작업을 수행합니다.
 *
 * @throws {ApiError} `404` - 사용자를 찾을 수 없을 때
 */
export const useUser = () => {
  const { id, name, image, setUser, updateUserData, initializeUser } = useUserStore((state) => ({
    id: state.id,
    name: state.name,
    image: state.image,
    setUser: state.setUser,
    updateUserData: state.updateUserData,
    initializeUser: state.initializeUser,
  }))

  const { handleApiError } = useApiError()

  if (!id || !name) {
    try {
      initializeUser()
    } catch (err) {
      if (err instanceof ApiError && err.status !== 404) {
        handleApiError(err)
      }
      throw err
    }
  }

  return {
    id,
    name,
    image,
    setUser,
    updateUserData,
  }
}
