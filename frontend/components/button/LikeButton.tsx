'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TailWindClasses } from '@/types/component-util.types'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import "../icon.css"

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
        className='icon'
        data-testid="like-icon"
        fill={liked ? 'red' : 'transparent'}
        strokeWidth={liked ? 0 : 2}
      />
    </Button>
  )
}

export default LikeButton
