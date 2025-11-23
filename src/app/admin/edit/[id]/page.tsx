import prisma from "@/app/lib/prisma";
import PostForm from "@/app/ui/post-form";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
