'use client'

import { useUserInfo } from '@/features/user/hooks/useUserInfo'
import { HomeSidebarNav } from '@/layouts/home/HomeSidebarNav'
import { HomeSidebarUser } from '@/layouts/home/HomeSidebarUser'
import { cn } from '@/lib/utils/cn'
import { TailWindClasses } from '@/types/component-util.types'

export const HomeSidebar = ({ className }: TailWindClasses) => {
  const { image, name } = useUserInfo()

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-gray-50 border-r border-gray-200 p-6',
        className
      )}
    >
      <div className="flex flex-col justify-between h-full">
        <HomeSidebarNav className="gap-4" />
        <div className="flex justify-center">
          <HomeSidebarUser
            image={image}
            name={name || 'John Doe'}
            className="my-3 gap-2 p-2"
          />
        </div>
      </div>
    </div>
  )
}
