'use client'

import { MainNavbar } from '@/app/main/_components/MainNavbar'
import { MainUserProfile } from '@/app/main/_components/MainUserProfile'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TailWindClasses } from '@/lib/types/component-util.types'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MainSidebarProps extends TailWindClasses {
}

export const MainSidebar = ({ className }: MainSidebarProps) => {
  const { image, name } = useUserInfo()

  return (
    <div
      className={cn('flex flex-col h-screen bg-gray-50 border-r border-gray-200 p-6', className)}
    >
      <div className="flex flex-col justify-between h-full">
        <MainNavbar className="gap-4" />
        <div className="flex justify-center">
          <MainUserProfile image={image} name={name || 'John Doe'} className="my-3 gap-2 p-2" />
        </div>
      </div>
    </div>
  )
}
