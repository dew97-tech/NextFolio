import prisma from "@/app/lib/prisma";
import AdminPostsManager from "@/app/ui/admin-posts-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="w-full">
      <AdminPostsManager
        initialPosts={posts.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          published: p.published,
          date: p.date.toISOString(),
          readTime: p.readTime,
          tags: p.tags,
          thumbnail: p.thumbnail,
        }))}
      />
    </div>
  );
}
