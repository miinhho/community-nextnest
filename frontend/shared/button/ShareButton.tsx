'use client'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/shared/ui/button'
import { TailWindClasses } from '@/types/component-util.types'
import { Share } from 'lucide-react'

interface ShareButtonProps extends TailWindClasses {
  onClick: () => void
}

const ShareButton = ({ onClick, className }: ShareButtonProps) => {
  return (
    <Button
      variant="ghost"
      size='icon'
      className={cn('flex items-center', className)}
      onClick={onClick}
      aria-label='공유 버튼'
    >
      <Share />
    </Button>
  )
}

export default ShareButton
