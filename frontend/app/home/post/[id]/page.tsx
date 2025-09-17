import PostView from '@/features/post/components/PostView'
import { postGetQueryFn } from '@/features/post/query/post'
import { postCommentQueryFn } from '@/features/post/query/post-comment'
import { POST_QUERY } from '@/features/post/query/post-key'
import { INITIAL_PAGE } from '@/lib/constant'
import { getQueryClient } from '@/providers/QueryProvider'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const queryClient = getQueryClient()
  const { id } = await params

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [POST_QUERY.POST, id],
      queryFn: () => postGetQueryFn(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [POST_QUERY.COMMENT, id],
      queryFn: () => postCommentQueryFn(id, INITIAL_PAGE),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-2xl mx-auto my-6">
        <PostView postId={id} />
      </div>
    </HydrationBoundary>
  )
}
