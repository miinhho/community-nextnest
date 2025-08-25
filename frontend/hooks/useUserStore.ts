import { UserStoreContext } from '@/providers/UserStoreProvider'
import { UserStore } from '@/store/user.store'
import { useContext } from 'react'
import { useStore } from 'zustand'

/**
 * 사용자 스토어를 사용하는 훅
 */
export const useUserStore = <T>(selector: (store: UserStore) => T): T => {
  const ctx = useContext(UserStoreContext)
  if (!ctx) {
    throw new Error('useUserStore must be used within a UserStoreProvider')
  }
  return useStore(ctx, selector)
}
