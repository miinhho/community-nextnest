import { TailWindClasses } from '@/lib/types/component-util.types'
import { UserSchema } from '@/lib/types/schema.types'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

interface UserAvatarProps extends TailWindClasses {
  author: UserSchema
}

const PostUserAvatar = ({ author, className }: UserAvatarProps) => {
  return (
    <div className={className}>
      <Avatar>
        <AvatarImage src={author.image || ''} alt={author.name || ''} />
        <AvatarFallback>
          {author.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
      <>
        <div className="font-semibold text-neutral-900">{author.name}</div>
        <div className="text-xs text-neutral-500 flex gap-1">
          <span>@{author.name}</span>
          <span>.</span>
        </div>
      </>
    </div>
  )
}

export default PostUserAvatar
