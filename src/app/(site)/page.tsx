import { Awards } from "@/components/awards";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Awards />
    </>
  );
}
