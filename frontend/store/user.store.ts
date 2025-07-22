import { apiGet, apiPost } from '@/lib/axios'
import { ApiError } from '@/lib/error/api-error'
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
          } catch {
            throw new Error('로그아웃에 실패했습니다.')
          } finally {
            set(() => ({ ...initialState }))
          }
        },
        initializeUser: async () => {
          const response = await apiGet<UserData>('/api/user/me')

          if (response.success) {
            const userData = response.data
            set(() => ({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              image: userData.image,
              isVerified: !!userData.emailVerified,
            }))
          } else {
            set(() => ({ ...initialState }))
            throw new ApiError(
              response.status,
              response.message || '유저 정보를 불러오지 못했습니다.',
              response.data,
            )
          }
        },
      }),
      {
        name: 'user-storage',
      },
    ),
  )
}
