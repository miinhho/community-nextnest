import { useUserStore } from '@/providers/UserStoreProvider'

/**
 * 사용자의 이름과 이미지를 가져오는 훅
 */
export const useUserInfo = () => {
  const { name, image, initializeUser } = useUserStore((state) => ({
    name: state.name,
    image: state.image,
    initializeUser: state.initializeUser,
  }))

  if (!name) {
    initializeUser()
  }

  return {
    name,
    image,
  }
}
