'use client'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/shared/ui/button'
import { TailWindClasses } from '@/types/component-util.types'
import { MessageCircle } from 'lucide-react'

interface CommentButtonProps extends TailWindClasses {
  onClick: () => void
}

const CommentButton = ({ onClick, className }: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size='icon'
      className={cn('flex items-center', className)}
      onClick={onClick}
      aria-label='댓글 버튼'
    >
      <MessageCircle />
    </Button>
  )
}

export default CommentButton
