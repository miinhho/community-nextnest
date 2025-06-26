import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserState = {
  id: string;
  name: string;
  email: string;
  image?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
};

export type UserActions = {
  setUser: (user: UserState | null) => void;
  updateUserData: (data: Partial<UserState>) => void;
  logout: () => void;
};

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  image: undefined,
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  isVerified: false,
};

export const createUserStore = () => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) => set(() => ({ ...user })),
        updateUserData: (data) => set((state) => ({ ...state, ...data })),
        logout: () =>
          set(() => ({
            id: '',
            name: '',
            email: '',
            image: undefined,
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            isVerified: false,
          })),
      }),
      {
        name: 'user-storage',
      },
    ),
  );
};
