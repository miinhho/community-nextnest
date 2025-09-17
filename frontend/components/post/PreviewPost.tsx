'use client'

import CommentButton from '@/components/button/CommentButton'
import LikeButton from '@/components/button/LikeButton'
import ShareButton from '@/components/button/ShareButton'
import PostUserAvator from '@/components/post/PostUserAvator'
import { Card, CardContent } from '@/components/ui/card'
import { usePostLikeQuery, usePostQuery } from '@/lib/query/post.query'
import { toast } from 'sonner'

export const PreviewPostSkeleton = () => {
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

interface PreviewPostProps {
  postId: string
  onComment?: () => void
}

const PreviewPost = ({ postId, onComment }: PreviewPostProps) => {
  const { data, isLoading } = usePostQuery(postId)
  const { mutate: postLikeMutation } = usePostLikeQuery()

  if (isLoading || !data) return <PreviewPostSkeleton />
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
        <PostUserAvator author={author} />
      </CardContent>

      <div className="flex justify-start gap-x-3 px-6">
        <LikeButton onClick={handleLike} />
        <CommentButton onClick={handleComment} />
        <ShareButton onClick={handleShare} />
      </div>
    </Card>
  )
}

export default PreviewPost
