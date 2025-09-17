import { cn } from '@/lib/utils/cn'
import { TailWindClasses } from '@/types/component-util.types'
import { BellIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

export const HomeSidebarNav = ({ className }: TailWindClasses) => {
  return (
    <nav className={cn('flex flex-col justify-center', className)}>
      <Link
        href="/home"
        className="flex max-lg:justify-center-safe p-4 gap-x-6 rounded-lg hover:bg-gray-100 text-gray-700"
      >
        <HomeIcon className="flex" />
        <span className="max-lg:hidden">홈</span>
      </Link>
      <Link
        href="/home/notifications"
        className="flex max-lg:justify-center-safe p-4 gap-x-6 rounded-lg hover:bg-gray-100 text-gray-700"
      >
        <BellIcon className="flex" />
        <span className="max-lg:hidden">알림</span>
      </Link>
    </nav>
  )
}
