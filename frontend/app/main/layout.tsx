'use client'

import { MainSidebar } from '@/app/main/MainSidebar'
import { useUserStore } from '@/hooks/useUserStore'
import { cn } from '@/lib/utils'
import { UserStoreProvider } from '@/providers/UserStoreProvider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const image = useUserStore((state) => state.image)
  const name = useUserStore((state) => state.name)

  return (
    <UserStoreProvider>
      <div
        className={cn(
          'flex flex-col justify-self-center max-w-screen max-lg:min-w-screen min-w-7xl min-h-screen',
          'my-auto mx-0 pl-4 pr-4 max-lg:pl-0 max-lg:pr-0',
        )}
      >
        <MainSidebar image={image} name={name} />

        <div className="flex overflow-y-auto">{children}</div>
      </div>
    </UserStoreProvider>
  )
}
