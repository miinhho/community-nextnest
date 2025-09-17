import { DefaultAvatorImage } from '@/constants/images'
import { TailWindClasses } from '@/types/component-util.types'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'

interface PostAuthorProps extends TailWindClasses {
  author: {
    name: string | null
    image: string | null
  }
}

const PostAuthor = ({ author, className }: PostAuthorProps) => {
  const authorName = author.name ?? ''

  return (
    <div className={className}>
      <Avatar className='inline-flex items-center justify-center align-middle gap-x-2'>
        <AvatarImage
          src={author.image || DefaultAvatorImage}
          alt={authorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <p className="font-semibold text-base text-neutral-900">
          {authorName}
        </p>
      </Avatar>
    </div>
  )
}

export default PostAuthor
