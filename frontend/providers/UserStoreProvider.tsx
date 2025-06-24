'use client';

import { createUserStore } from '@/store/user.store';
import { createContext, useRef } from 'react';

export type UserStoreApi = ReturnType<typeof createUserStore>;
export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export const UserStoreProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<UserStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

