import { ContentModal } from "@/app/home/@modal/_components/ContentModal"
import PostPage from "@/app/home/post/[id]/page"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostModalPage(prop: PostPageProps) {
  return (
    <ContentModal>
      <PostPage {...prop} />
    </ContentModal>
  )
}
