import MainPost from '@/components/post/MainPost'
import { getQueryClient } from '@/lib/query'
import { POST_COMMENT_KEY, POST_KEY, postCommentQueryFn, postQueryFn } from '@/lib/query/post.query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [POST_KEY, id],
      queryFn: () => postQueryFn(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [POST_COMMENT_KEY, id],
      queryFn: () => postCommentQueryFn(id, { page: 1, size: 10 }),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-2xl mx-auto my-6">
        <MainPost postId={id} />
      </div>
    </HydrationBoundary>
  )
}
