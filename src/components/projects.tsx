"use client";

import { TiltCard } from "@/components/motion/tilt-card";
import { resumeData } from "@/data/resume";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motion } from "framer-motion";
import { ExternalLink, FolderKanban, Github } from "lucide-react";
import { useRef } from "react";

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollAnimation(containerRef as React.RefObject<HTMLElement>);

  const allProjects = resumeData.experience.flatMap((job) =>
    job.projects.map((project) => ({
      ...project,
      company: job.company,
    }))
  );

  return (
    <section
      id="projects"
      className="py-20 relative"
      ref={containerRef}
      aria-labelledby="projects-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/20 text-primary text-sm font-medium mb-4"
          >
            <FolderKanban className="h-4 w-4" />
            Portfolio
          </motion.span>
          <h2 id="projects-heading" className="text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <motion.div
            className="w-20 h-1.5 bg-primary mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            A selection of key projects I've engineered, driving impact through AI, optimization, and robust architecture.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <TiltCard
                className="h-full"
                tiltAmount={8}
                glareOpacity={0.1}
              >
                <div className="group relative bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-xl hover:shadow-primary/10">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    aria-hidden="true"
                  />

                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    aria-hidden="true"
                  />

                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                          {project.name}
                        </h3>
                        <motion.p
                          className="text-xs text-muted-foreground mt-1 flex items-center gap-1"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" aria-hidden="true" />
                          at {project.company}
                        </motion.p>
                      </div>
                      <div
                        className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        role="group"
                        aria-label="Project links"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full hover:bg-accent cursor-pointer"
                        >
                          <Github className="h-4 w-4 text-muted-foreground hover:text-primary" aria-hidden="true" />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full hover:bg-accent cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" aria-hidden="true" />
                        </motion.div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2" role="list">
                        {project.achievements.slice(0, 2).map((achievement, i) => (
                          <motion.li
                            key={i}
                            className="text-xs text-foreground/80 flex gap-2 items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i, duration: 0.4 }}
                          >
                            <motion.span
                              className="text-primary mt-0.5 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                              aria-hidden="true"
                            >
                              •
                            </motion.span>
                            <span className="line-clamp-2">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
