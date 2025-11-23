import PostForm from "@/app/ui/post-form";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Create New Post</h1>
      <PostForm />
    </div>
  );
}
