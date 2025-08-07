import MainPost from '@/components/post/MainPost'
import { INITIAL_PAGE } from '@/lib/constant'
import { getQueryClient } from '@/lib/query'
import { POST_COMMENT_KEY, POST_KEY, postCommentQueryFn, postQueryFn } from '@/lib/query/post.query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage(prop: PostPageProps) {
  const queryClient = getQueryClient()
  const { id } = await prop.params

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [POST_KEY, id],
      queryFn: () => postQueryFn(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [POST_COMMENT_KEY, id],
      queryFn: () => postCommentQueryFn(id, INITIAL_PAGE),
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
