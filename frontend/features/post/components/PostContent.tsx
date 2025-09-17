'use client'

import PostAuthor from '@/features/post/components/PostAuthor'
import { usePostGetQuery } from '@/features/post/query/post'
import { usePostLikeQuery } from '@/features/post/query/post-like'
import CommentButton from '@/shared/button/CommentButton'
import LikeButton from '@/shared/button/LikeButton'
import ShareButton from '@/shared/button/ShareButton'
import { Card, CardContent } from '@/shared/ui/card'
import { toast } from 'sonner'

export const PostContentSkeleton = () => {
  return (
    <Card className="flex max-w-xl mx-auto shadow-sm border animate-pulse">
      <CardContent>
        <div className="inline-flex items-center justify-center align-middle gap-x-2">
          <div className="w-12 h-12 bg-gray-300 rounded-full object-cover" />
          <div className="h-6 w-20 bg-gray-300 rounded" />
        </div>
        <div className='relative min-w-md mr-auto ml-auto mt-3'>
          <div className="relative resize-none text-base tab-1 min-h-10 h-auto bg-gray-300 rounded" />
        </div>
      </CardContent>
      <div className="flex justify-start gap-x-5 px-6">
        <div className="h-6 w-6 bg-gray-300 rounded-full" />
        <div className="h-6 w-6 bg-gray-300 rounded-full" />
        <div className="h-6 w-6 bg-gray-300 rounded-full" />
      </div>
    </Card>
  )
}

interface PostContentProps {
  postId: string
  onComment?: () => void
}

const PostContent = ({ postId, onComment }: PostContentProps) => {
  const { data, isLoading } = usePostGetQuery(postId)
  const { mutate: postLikeMutation } = usePostLikeQuery()

  if (isLoading || !data) return <PostContentSkeleton />
  const { author, content } = data

  const handleLike = () => {
    postLikeMutation(postId, {
      onError: () => {
        toast.error('좋아요 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      },
    })
  }

  // TODO : 댓글 에디터 표시
  const displayCommentEditor = () => {

  }

  const handleComment = () => {
    displayCommentEditor()
    onComment?.()
  }

  const handleShare = async () => {
    const postUrl = window.location.href
    await navigator.clipboard.writeText(postUrl)
    toast.success('링크가 성공적으로 복사되었습니다!')
  }

  return (
    <Card className="flex max-w-xl mx-auto shadow-sm border">
      <CardContent>
        <PostAuthor author={author} />
      </CardContent>

      <div className="flex justify-start gap-x-3 px-6">
        <LikeButton onClick={handleLike} />
        <CommentButton onClick={handleComment} />
        <ShareButton onClick={handleShare} />
      </div>
    </Card>
  )
}

export default PostContent
