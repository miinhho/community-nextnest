'use client'

import { useUserStore } from '@/providers/UserStoreProvider'
import { useShallow } from 'zustand/shallow'

export const useUser = () => {
  const { id, name, image, setUser, updateUserData, initializeUser } = useUserStore(
    useShallow((state) => ({
      id: state.id,
      name: state.name,
      image: state.image,
      setUser: state.setUser,
      updateUserData: state.updateUserData,
      initializeUser: state.initializeUser,
    })),
  )

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
