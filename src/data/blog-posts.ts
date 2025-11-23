export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "diy-meo-guide",
    title: "Complete Guide to DIY MEO (Map Engine Optimization)",
    description: "Learn how to rank your local business on Google Maps without spending a fortune. A comprehensive guide to Google Business Profile optimization.",
    date: "2025-11-23",
    readTime: "10 min read",
    tags: ["SEO", "MEO", "Google Maps", "Marketing"],
  },
];
