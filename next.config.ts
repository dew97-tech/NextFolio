import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Only the hosts we actually serve images from: Vercel Blob (uploaded
    // thumbnails) and Unsplash (a few hand-written posts). A wildcard here
    // turns the Image Optimizer into an open proxy anyone can bill to us.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  compress: true,

  poweredByHeader: false,

  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        // Authenticated admin HTML must never be stored by a shared cache,
        // otherwise an unauthenticated visitor could be served an admin page.
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },
};

export default nextConfig;
