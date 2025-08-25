import { TailWindClasses } from '@/lib/types/component-util.types'
import { UserSchema } from '@/lib/types/schema.types'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

interface UserAvatarProps extends TailWindClasses {
  author: UserSchema
}

const PostUserAvatar = ({ author, className }: UserAvatarProps) => {
  const authorName = author.name ?? ''
  const fallbackAuthorName = authorName.split(' ').map((name) => name[0]).join('')

  return (
    <div className={className}>
      <Avatar>
        <AvatarImage src={author.image || ''} alt={authorName} />
        <AvatarFallback>
          {fallbackAuthorName}
        </AvatarFallback>
      </Avatar>
      <>
        <p className="font-semibold text-neutral-900">{authorName}</p>
        <div className="text-xs text-neutral-500 flex gap-1">
          <span>@{authorName}</span>
          <span>.</span>
        </div>
      </>
    </div>
  )
}

export default PostUserAvatar
