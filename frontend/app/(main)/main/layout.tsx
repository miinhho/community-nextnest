'use client'

import { MainSidebar } from '@/app/(main)/main/MainSidebar'
import { useUserStore } from '@/hooks/useUserStore'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const image = useUserStore((state) => state.image)
  const name = useUserStore((state) => state.name)

  return (
    <div className="flex min-h-screen">
      <MainSidebar image={image} name={name} />

      <div className="flex overflow-y-auto">{children}</div>
    </div>
  )
}
