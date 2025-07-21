'use client';

import PreviewPost from "@/components/post/PreviewPost";

interface MainPostProps {
  postId: string;
}

// TODO : 댓글을 페이징해서 볼 수 있도록 구현
const MainPost = ({ postId }: MainPostProps) => {
  return (
    <>
      <PreviewPost
        postId={postId}
      />
      {/* TODO : 댓글 컴포넌트가 페이징되어 무한 스크롤 되도록 추가 */}
    </>
  )
}

export default MainPost