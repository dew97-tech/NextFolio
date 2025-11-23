import prisma from "@/app/lib/prisma";
import DeletePostButton from "@/app/ui/delete-post-button";
import { EyeIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function AdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" },
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p: any) => p.published).length,
    drafts: posts.filter((p: any) => !p.published).length,
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Post</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{stats.total}</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>
        
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Published</p>
            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-secondary-foreground">{stats.published}</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.published}</p>
        </div>
        
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Drafts</p>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-lg font-bold text-muted-foreground">{stats.drafts}</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.drafts}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No blog posts yet</p>
                      <Link
                        href="/admin/new"
                        className="text-sm text-primary hover:underline"
                      >
                        Create your first post
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{post.title}</span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {post.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <span className="inline-flex items-center rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            title="View post"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
