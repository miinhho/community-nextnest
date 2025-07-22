import { UserStoreContext } from '@/providers/UserStoreProvider'
import { UserStore } from '@/store/user.store'
import { useContext } from 'react'
import { useStore } from 'zustand'

export const useUserStore = <T>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext)

  if (!userStoreContext) {
    throw new Error('useUserStore must be used within a UserStoreProvider')
  }

  return useStore(userStoreContext, selector)
}
