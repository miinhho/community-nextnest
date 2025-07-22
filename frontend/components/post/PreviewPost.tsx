'use client'

import CommentButton from '@/components/button/CommentButton'
import LikeButton from '@/components/button/LikeButton'
import ShareButton from '@/components/button/ShareButton'
import { LexicalViewer } from '@/components/editor/LexicalViewer'
import PostUserAvator from '@/components/post/PostUserAvatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { usePostLikeQuery, usePostQuery } from '@/lib/query/post.query'
import { LikeStatus } from '@/lib/types/status.types'
import { Separator } from '@radix-ui/react-separator'
import { useCallback } from 'react'

interface PreviewPostProps {
  postId: string
  onComment?: () => void
}

// TODO : alert 대신 모달을 통해 표시하기
const PreviewPost = ({ postId, onComment }: PreviewPostProps) => {
  const { data } = usePostQuery(postId)
  const { author, content } = data!
  const { mutate: postLikeMutation } = usePostLikeQuery()

  const handleLike = useCallback(() => {
    postLikeMutation(postId, {
      onSuccess: (data) => {
        if (data.status === LikeStatus.PLUS) {
          alert('좋아요를 눌렀습니다!')
        } else if (data.status === LikeStatus.MINUS) {
          alert('좋아요를 취소했습니다!')
        }
      },
      onError: () => {
        alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      },
    })
  }, [postId, postLikeMutation])

  // TODO : 댓글 에디터 표시
  const handleComment = () => {}

  const handleShare = useCallback(async () => {
    const postUrl = `${process.env.URL}/post/${postId}`
    await navigator.clipboard.writeText(postUrl)
    alert('링크가 성공적으로 복사되었습니다!')
  }, [postId])

  return (
    <Card className="max-w-xl mx-auto my-6 shadow-sm border">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <PostUserAvator author={author} />
      </CardHeader>
      <Separator />

      <CardContent className="py-4">
        <LexicalViewer json={content} />
      </CardContent>
      <Separator />

      {/* 댓글, 좋아요, 공유 섹션 */}
      <div className="flex items-center gap-4 px-6 py-2 text-neutral-500">
        <CommentButton onClick={onComment || handleComment} />
        <LikeButton onClick={handleLike} />
        <ShareButton onClick={handleShare} />
      </div>
    </Card>
  )
}

export default PreviewPost
