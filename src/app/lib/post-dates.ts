export function publishedDate(post: {
  publishedAt: Date | null;
  date: Date;
}): Date {
  return post.publishedAt ?? post.date;
}
