import { cn } from '@/lib/utils'
import { TailWindClasses } from '@/types/component-util.types'
import Image from 'next/image'

interface MainUserProfileProps extends TailWindClasses {
  image: string | null
  name: string | null
}

export const MainUserProfile = ({ image, name, className }: MainUserProfileProps) => {
  return (
    <div className={cn('flex flex-row justify-center rounded-md bg-white shadow-sm', className)}>
      <Image
        src={image || '/default-avatar.webp'}
        alt={name || 'User Avatar'}
        className="flex rounded-full"
        width={64}
        height={64}
      />
      <span className="py-4 flex justify-self-end text-lg font-semibold max-lg:hidden">{name}</span>
    </div>
  )
}
