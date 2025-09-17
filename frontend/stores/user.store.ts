import { fetcher } from '@/lib/client'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserState = {
  id: string
  name: string
  email: string
  image: string | null
  isVerified: boolean
}

export type UserActions = {
  setUser: (user: UserState | null) => void
  updateUserData: (data: Partial<UserState>) => void
  logout: () => void
  initializeUser: () => Promise<void>
}

export type UserStore = UserState & UserActions

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  image: null,
  isVerified: false,
}

export const createUserStore = () =>
  createStore<UserStore>()(
    persist(
      (set) => ({
        ...initialState,
        setUser: (user) => {
          if (user) {
            set(() => ({ ...user }))
          } else {
            set(() => ({ ...initialState }))
          }
        },
        updateUserData: (data) => set((state) => ({ ...state, ...data })),
        logout: async () => {
          try {
            await fetcher.POST('/auth/logout')
          } finally {
            set(() => ({ ...initialState }))
          }
        },
        initializeUser: async () => {
          try {
            const { data } = await fetcher.GET('/user/me')
            const { id, name, email, image, emailVerified } = data!

            set(() => ({
              id,
              name,
              email,
              image,
              isVerified: !!emailVerified,
            }))
          } catch {
            set(() => ({ ...initialState }))
          }
        },
      }),
      {
        name: 'user-storage',
      },
    ),
  )
