import { MainNavbar } from '@/app/main/MainNavbar'
import { MainUserProfile } from '@/app/main/MainUserProfile'
import { TailWindClasses } from '@/lib/types/component-util.types'
import { cn } from '@/lib/utils'

interface MainSidebarProps extends TailWindClasses {
  image?: string
  name?: string
}

export const MainSidebar = ({ image, name, className }: MainSidebarProps) => {
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
