import { listRecentReviews } from "@/app/lib/ai/review-article";
import prisma from "@/app/lib/prisma";
import { getReviewSettings } from "@/app/lib/settings";
import { isWebSearchConfigured } from "@/app/lib/web-search";
import ArticleReviewPanel from "@/app/ui/article-review-panel";
import PostForm from "@/app/ui/post-form";
import { notFound } from "next/navigation";

export const maxDuration = 300;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const [reviews, reviewSettings] = await Promise.all([
    listRecentReviews(post.id),
    getReviewSettings(),
  ]);

  return (
    <div className="w-full space-y-8">
      <PostForm post={post} />

      <ArticleReviewPanel
        postId={post.id}
        current={{ title: post.title, description: post.description }}
        initialHistory={reviews}
        reviewModel={reviewSettings.modelId}
        webSearchConfigured={isWebSearchConfigured()}
      />
    </div>
  );
}
