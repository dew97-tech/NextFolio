"use client";

import { resumeData } from "@/data/resume";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export function Projects() {
  // Flatten projects from experience
  const allProjects = resumeData.experience.flatMap((job) =>
    job.projects.map((project) => ({
      ...project,
      company: job.company,
    }))
  );

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A selection of key projects I&apos;ve engineered, driving impact through AI, optimization, and robust architecture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors flex flex-col h-full"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 flex flex-col flex-grow relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      at {project.company}
                    </p>
                  </div>
                  {/* Placeholder links - in a real scenario, these would be in the data */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                    <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {project.achievements.slice(0, 2).map((achievement, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex gap-2">
                        <span className="text-primary">•</span>
                        <span className="line-clamp-2">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
