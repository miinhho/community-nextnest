'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
      <Share className="icon" />
    </Button>
  )
}

export default ShareButton
