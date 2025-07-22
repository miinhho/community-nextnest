import { TailWindClasses } from '@/lib/types/component-util.types'
import { cn } from '@/lib/utils'
import { BellIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MainNavbarProps extends TailWindClasses {}

export const MainNavbar = ({ className }: MainNavbarProps) => {
  return (
    <nav className={cn('flex flex-col justify-center', className)}>
      <Link
        href="/main"
        className="flex max-lg:justify-center-safe p-4 gap-x-6 rounded-lg hover:bg-gray-100 text-gray-700"
      >
        <HomeIcon className="flex" />
        <span className="max-lg:hidden">홈</span>
      </Link>
      <Link
        href="/main/notifications"
        className="flex max-lg:justify-center-safe p-4 gap-x-6 rounded-lg hover:bg-gray-100 text-gray-700"
      >
        <BellIcon className="flex" />
        <span className="max-lg:hidden">알림</span>
      </Link>
    </nav>
  )
}
