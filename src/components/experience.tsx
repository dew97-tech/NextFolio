"use client";

import { resumeData } from "@/data/resume";
import { usePhysics } from "@/lib/motion/physics-context";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useRef } from "react";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = usePhysics();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section
      id="experience"
      className="py-20 bg-accent/5 relative overflow-hidden scroll-mt-20 md:scroll-mt-24"
      ref={containerRef}
      aria-labelledby="experience-heading"
    >
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

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
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/30 text-primary text-sm font-medium mb-4"
          >
            <Briefcase className="h-4 w-4" />
            Career Journey
          </motion.span>
          <h2 id="experience-heading" className="text-3xl md:text-5xl font-bold mb-4">Experience</h2>
          <motion.div
            className="w-20 h-1.5 bg-primary mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        <div className="relative max-w-5xl mx-auto" role="list" aria-label="Work experience timeline">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/30" aria-hidden="true">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-secondary origin-top"
              style={{ height: reducedMotion ? "100%" : lineHeight }}
              aria-hidden="true"
            />
          </div>

          {resumeData.experience.map((job, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`relative mb-12 md:mb-20 ${
                index % 2 === 0 ? "md:text-right" : "md:text-left"
              }`}
              role="listitem"
            >
              <motion.div
                className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background transform -translate-x-1/2 mt-1.5 z-10"
                whileInView={reducedMotion ? {} : {
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                aria-hidden="true"
              >
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  animate={reducedMotion ? {} : { scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  aria-hidden="true"
                />
              </motion.div>

              <div
                className={`pl-12 md:pl-0 ${
                  index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                } grid md:grid-cols-2 gap-4 md:gap-8`}
              >
                <motion.div
                  className={index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50 hover:border-primary/30 transition-all duration-500 group">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-t-xl"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      aria-hidden="true"
                    />

                    <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-primary/80 transition-colors">{job.role}</h3>
                    <h4 className="text-lg font-semibold mb-3">{job.company}</h4>

                    <div className={`flex flex-wrap gap-3 text-sm text-muted-foreground mb-4 ${
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}>
                      <motion.div
                        className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <span>{job.date}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        <span>{job.location}</span>
                      </motion.div>
                    </div>

                    {job.promotions && (
                      <motion.div
                        className="mb-4 p-3 bg-accent/10 rounded-lg text-sm border border-accent/20"
                        initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <p className="font-semibold text-primary">Previous Role:</p>
                        {job.promotions.map((promo, i) => (
                          <div key={i} className="flex justify-between items-center mt-1">
                            <span>{promo.role}</span>
                            <span className="text-muted-foreground text-xs">{promo.date}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <div className="space-y-4" role="list" aria-label="Projects">
                      {job.projects.map((project, pIndex) => (
                        <motion.div
                          key={pIndex}
                          className="text-left"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + pIndex * 0.1, duration: 0.4 }}
                          role="listitem"
                        >
                          <h5 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                            <motion.span
                              animate={reducedMotion ? {} : { rotate: [0, 10, 0] }}
                              transition={{ duration: 3, repeat: Infinity, delay: pIndex * 0.2 }}
                              aria-hidden="true"
                            >
                              <Briefcase className="h-4 w-4 text-primary" />
                            </motion.span>
                            {project.name}
                          </h5>
                          <p className="text-sm text-muted-foreground mt-1 mb-2 leading-relaxed">
                            {project.description}
                          </p>
                          <ul className="space-y-2" role="list">
                            {project.achievements.slice(0, 3).map((achievement, aIndex) => (
                              <motion.li
                                key={aIndex}
                                className="text-sm text-muted-foreground/90 flex items-start gap-2"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + aIndex * 0.1, duration: 0.3 }}
                              >
                                <motion.span
                                  className="text-primary mt-1 flex-shrink-0"
                                  animate={reducedMotion ? {} : { scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: aIndex * 0.2 }}
                                  aria-hidden="true"
                                >
                                  •
                                </motion.span>
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                            {project.achievements.length > 3 && (
                              <li className="list-none text-primary text-xs pt-1 italic ml-4">
                                + {project.achievements.length - 3} more achievements...
                              </li>
                            )}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
