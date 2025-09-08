'use client'

import { createUserStore, UserStore } from '@/stores/user.store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type UserStoreApi = ReturnType<typeof createUserStore>
const UserStoreContext = createContext<UserStoreApi | undefined>(undefined)

export const UserStoreProvider = ({ children }: React.PropsWithChildren) => {
  const storeRef = useRef<UserStoreApi | null>(null)
  if (!storeRef.current) {
    storeRef.current = createUserStore()
  }

  return (
    <UserStoreContext value={storeRef.current}>
      {children}
    </UserStoreContext>
  )
}

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const ctx = useContext(UserStoreContext)
  if (!ctx) {
    throw new Error('useUserStore must be used within a UserStoreProvider')
  }
  return useStore(ctx, selector)
}