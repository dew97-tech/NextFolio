import { Awards } from "@/components/awards";
import { CursorTrail } from "@/components/cursor-trail";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <CursorTrail />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Awards />
    </div>
  );
}
