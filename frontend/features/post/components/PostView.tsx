'use client'

import PostContent from "@/features/post/components/PostContent"

interface PostViewProps {
  postId: string
}

// TODO : 댓글을 페이징해서 볼 수 있도록 구현
const PostView = ({ postId }: PostViewProps) => {
  return (
    <>
      <PostContent postId={postId} />
      {/* TODO : 댓글 컴포넌트가 페이징되어 무한 스크롤 되도록 추가 */}
    </>
  )
}

export default PostView
