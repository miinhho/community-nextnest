import { useUserStore } from '@/hooks/useUserStore'

/**
 * 사용자의 이름과 이미지를 가져오는 훅
 */
export const useUserInfo = () => {
  return useUserStore((state) => ({
    name: state.name,
    image: state.image,
  }))
}
