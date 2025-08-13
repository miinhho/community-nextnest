import { handleApiError } from '@/lib/api-error'
import { apiGet, apiPost } from '@/lib/ky'
import { UserData } from '@/lib/query/user.query'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserState = {
  id: string
  name: string
  email: string
  image?: string
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
  image: undefined,
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
            await apiPost('/api/auth/logout')
          } finally {
            set(() => ({ ...initialState }))
          }
        },
        initializeUser: async () => {
          try {
            const { data: userData } = await apiGet<UserData>('/api/user/me')
            set(() => ({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              image: userData.image,
              isVerified: !!userData.emailVerified,
            }))
          } catch (err) {
            set(() => ({ ...initialState }))
            handleApiError(err)
          }
        },
      }),
      {
        name: 'user-storage',
      },
    ),
  )
}
