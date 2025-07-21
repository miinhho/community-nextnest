import MainPost from "@/components/post/MainPost";
import { getQueryClient } from "@/lib/query";
import { postCommentQueryFn, postQueryFn } from "@/lib/query/post.query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = getQueryClient();

  // 미리 게시글 데이터와 댓글 데이터를 가져온다
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['post', id],
      queryFn: () => postQueryFn(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ['postComment', id],
      queryFn: () => postCommentQueryFn(id, { page: 1, size: 10 }),
    })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-2xl mx-auto my-6">
        <MainPost postId={id} />
      </div>
    </HydrationBoundary>
  );
}