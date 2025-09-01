import { fetcher } from '@/lib/client'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserState = {
  id: string
  name: string
  email: string
  image: string | null
  isVerified: boolean
  accessToken?: string
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

export const createUserStore = () => {
  return createStore<UserStore>()(
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
            if (!data?.data) {
              throw new Error('Service Unavailable')
            }

            const { data: userData } = data
            set(() => ({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              image: userData.image,
              isVerified: !!userData.emailVerified,
            }))
          } catch (err) {
            set(() => ({ ...initialState }))
          }
        },
      }),
      {
        name: 'user-storage',
      },
    ),
  )
}
