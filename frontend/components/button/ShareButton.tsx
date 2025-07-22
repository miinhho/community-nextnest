'use client'

import { Button } from '@/components/ui/button'
import { SizeProps, TailWindClasses } from '@/lib/types/component-util.types'
import { cn } from '@/lib/utils'
import { Share } from 'lucide-react'

interface ShareButtonProps extends TailWindClasses, SizeProps {
  onClick: () => void
}

const ShareButton = ({ onClick, className, size }: ShareButtonProps) => {
  return (
    <Button
      variant="ghost"
      size={size || 'sm'}
      className={cn('flex items-center gap-1', className)}
      onClick={onClick}
    >
      <Share className="w-4 h-4" />
      <span className="sr-only">공유</span>
    </Button>
  )
}

export default ShareButton
