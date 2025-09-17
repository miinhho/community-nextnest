'use client'

import { useUserStore } from '@/features/user/stores/provider'

export const useUser = () => {
  const id = useUserStore((state) => state.id)
  const name = useUserStore((state) => state.name)
  const image = useUserStore((state) => state.image)
  const setUser = useUserStore((state) => state.setUser)
  const updateUserData = useUserStore((state) => state.updateUserData)
  const initializeUser = useUserStore((state) => state.initializeUser)

  if (!id) {
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
