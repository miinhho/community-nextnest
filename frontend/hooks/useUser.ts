import { useUserStore } from '@/providers/UserStoreProvider'

/**
 * 사용자 정보를 가져오는 훅
 *
 * 사용자가 로그인되어 있지 않거나 사용자 정보가 없는 경우, 초기화 작업을 수행합니다.
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

  if (!id || !name) {
    initializeUser()
  }

  return {
    id,
    name,
    image,
    setUser,
    updateUserData,
  }
}
