'use client'

import { useUserStore } from '@/features/user/stores/provider'

export const useUserInfo = () => {
  const id = useUserStore((state) => state.id)
  const name = useUserStore((state) => state.name)
  const image = useUserStore((state) => state.image)
  const initializeUser = useUserStore((state) => state.initializeUser)

  if (!id) {
    initializeUser()
  }

  return {
    name: name,
    image: image,
  }
}
