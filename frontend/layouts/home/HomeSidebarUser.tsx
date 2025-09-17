import { DefaultAvatorImage } from '@/lib/constants/images'
import { cn } from '@/lib/utils/cn'
import { TailWindClasses } from '@/types/component-util.types'
import Image from 'next/image'

interface HomeSidebarUserProfile extends TailWindClasses {
  image: string | null
  name: string | null
}

export const HomeSidebarUser = ({ image, name, className }: HomeSidebarUserProfile) => {
  return (
    <div className={cn(
      'flex flex-row justify-center rounded-md bg-white shadow-sm',
      className
    )}>
      <Image
        src={image || DefaultAvatorImage}
        alt={name || 'User Avatar'}
        className="flex rounded-full"
        width={64}
        height={64}
      />
      <span className="py-4 flex justify-self-end text-lg font-semibold max-lg:hidden">
        {name}
      </span>
    </div>
  )
}
