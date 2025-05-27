import { findPostById } from "@/lib/actions/post";
import { notFound } from "next/navigation";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await findPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <article className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <p className="text-gray-600 text-center">by {post.author?.name}</p>
        <div className="mt-8">
          {post.content || "No content available."}
        </div>
      </article>
    </div>
  )
}