'use client'

import { Button } from '@/components/ui/button'
import { SizeProps, TailWindClasses } from '@/lib/types/component-util.types'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

interface CommentButtonProps extends TailWindClasses, SizeProps {
  onClick: () => void
}

const CommentButton = ({ onClick, className, size }: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size={size || 'sm'}
      className={cn('flex items-center gap-1', className)}
      onClick={onClick}
    >
      <MessageCircle className="w-4 h-4" />
      <span className="sr-only">댓글</span>
    </Button>
  )
}

export default CommentButton
