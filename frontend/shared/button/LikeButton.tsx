'use client'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/shared/ui/button'
import { TailWindClasses } from '@/types/component-util.types'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface LikeButtonProps extends TailWindClasses {
  onClick: () => void
}

const LikeButton = ({ onClick, className }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onClick()
  }

  return (
    <Button
      variant="ghost"
      size='icon'
      className={cn('flex items-center', className)}
      onClick={handleLike}
      aria-label='좋아요 버튼'
      data-testid="like-button"
    >
      <Heart
        data-testid="like-icon"
        fill={liked ? 'red' : 'transparent'}
        strokeWidth={liked ? 0 : 2}
      />
    </Button>
  )
}

export default LikeButton
