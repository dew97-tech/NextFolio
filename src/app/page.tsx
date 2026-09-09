import { ExperienceSkeleton, HeroSkeleton, ProjectsSkeleton, SkillsSkeleton } from '@/components/ui/skeletons';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Awards = dynamic(() => import('@/components/awards').then(mod => ({ default: mod.Awards })), {
  loading: () => <Suspense fallback={null}><div className="h-96 animate-pulse bg-muted/20 rounded-lg" /></Suspense>,
  ssr: true,
});

const Experience = dynamic(() => import('@/components/experience').then(mod => ({ default: mod.Experience })), {
  loading: () => <Suspense fallback={<ExperienceSkeleton />}><div className="h-96" /></Suspense>,
  ssr: true,
});

const Hero = dynamic(() => import('@/components/hero').then(mod => ({ default: mod.Hero })), {
  loading: () => <Suspense fallback={<HeroSkeleton />}><div className="h-screen" /></Suspense>,
  ssr: true,
});

const Projects = dynamic(() => import('@/components/projects').then(mod => ({ default: mod.Projects })), {
  loading: () => <Suspense fallback={<ProjectsSkeleton />}><div className="h-96" /></Suspense>,
  ssr: true,
});

const Skills = dynamic(() => import('@/components/skills').then(mod => ({ default: mod.Skills })), {
  loading: () => <Suspense fallback={<SkillsSkeleton />}><div className="h-96" /></Suspense>,
  ssr: true,
});

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Awards />
    </div>
  );
}
