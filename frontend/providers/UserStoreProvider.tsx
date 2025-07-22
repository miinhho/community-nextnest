'use client'

import { createUserStore } from '@/store/user.store'
import { createContext, useRef } from 'react'

export type UserStoreApi = ReturnType<typeof createUserStore>
export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined)

export const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<UserStoreApi | null>(null)
  // useRef를 사용하여 스토어를 한 번만 생성하고 재사용
  // 렌더링 될 때마다 새로운 스토어를 생성하지 않도록 함
  if (!storeRef.current) {
    storeRef.current = createUserStore()
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}
