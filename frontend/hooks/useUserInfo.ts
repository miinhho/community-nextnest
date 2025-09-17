'use client'

import { useUserStore } from '@/providers/UserStoreProvider'
import { useShallow } from 'zustand/shallow'

export const useUserInfo = () => {
  const { id, name, image, initializeUser } = useUserStore(
    useShallow((state) => ({
      id: state.id,
      name: state.name,
      image: state.image,
      initializeUser: state.initializeUser,
    })),
  )

  if (!id) {
    initializeUser()
  }

  return {
    name: name,
    image: image,
  }
}
