"use client";

import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <motion.div 
      className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
      </div>
    </motion.div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - (i % 3) * 15}%` }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <div className="h-8 w-48 bg-muted rounded-full animate-pulse" />
        <div className="space-y-4 w-full max-w-2xl">
          <div className="h-16 md:h-20 bg-muted rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-muted rounded-full animate-pulse" />
          <div className="h-12 w-32 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="relative mb-12 pl-12 md:pl-0"
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-muted rounded-full border-4 border-background transform -translate-x-1/2 mt-1.5" />
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border space-y-4">
            <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded-full w-24 animate-pulse" />
              <div className="h-6 bg-muted rounded-full w-24 animate-pulse" />
            </div>
            <TextSkeleton lines={3} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border space-y-3">
            <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded w-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
