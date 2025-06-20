import { Post } from "@/components/Post";
import { getQueryClient } from "@/lib/query";
import { postQueryFn } from "@/lib/query/post.query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => postQueryFn(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-2xl mx-auto my-6">
        <Post postId={id} />
      </div>
    </HydrationBoundary>
  );
}