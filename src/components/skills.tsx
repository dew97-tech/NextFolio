"use client";

import { resumeData } from "@/data/resume";
import { usePhysics } from "@/lib/motion/physics-context";
import { motion } from "framer-motion";
import { BookOpen, Code, GraduationCap, Sparkles } from "lucide-react";

export function Skills() {
  const { reducedMotion } = usePhysics();

  const getFloatingAnimation = (index: number) => ({
    y: reducedMotion ? 0 : [0, -5, 0],
    transition: {
      duration: 3 + (index % 3),
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: index * 0.1,
    },
  });

  return (
    <section
      id="skills"
      className="py-20 bg-accent/5 relative overflow-hidden"
      aria-labelledby="skills-heading"
    >
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={reducedMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                className="p-3 rounded-xl bg-primary/10 text-primary shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Code className="h-6 w-6" />
              </motion.div>
              <h2 id="skills-heading" className="text-3xl md:text-4xl font-bold">Technical Skills</h2>
            </div>

            <div className="space-y-10">
              <div>
                <motion.h3
                  className="text-lg font-semibold mb-6 flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
                  Languages & Frameworks
                </motion.h3>
                <div className="flex flex-wrap gap-3" role="list" aria-label="Programming languages and frameworks">
                  {resumeData.skills.languagesAndFrameworks.map((skill, index) => (
                    <motion.span
                      key={index}
                      role="listitem"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      animate={getFloatingAnimation(index)}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                        backgroundColor: "rgba(96, 165, 250, 0.2)",
                        borderColor: "rgba(96, 165, 250, 0.5)",
                      }}
                      className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-sm font-medium cursor-default shadow-sm hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <motion.h3
                  className="text-lg font-semibold mb-6 flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="w-8 h-0.5 bg-secondary rounded-full" aria-hidden="true" />
                  Methodologies
                </motion.h3>
                <div className="flex flex-wrap gap-3" role="list" aria-label="Development methodologies">
                  {resumeData.skills.methodologies.map((skill, index) => (
                    <motion.span
                      key={index}
                      role="listitem"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + index * 0.05,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      animate={getFloatingAnimation(index + 20)}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                        backgroundColor: "rgba(129, 140, 248, 0.2)",
                        borderColor: "rgba(129, 140, 248, 0.5)",
                      }}
                      className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-sm font-medium cursor-default shadow-sm hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="p-3 rounded-xl bg-secondary/10 text-secondary-foreground shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <GraduationCap className="h-6 w-6" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold">Education</h2>
              </div>

              <div className="space-y-6" role="list" aria-label="Education history">
                {resumeData.education.map((edu, index) => (
                  <motion.article
                    key={index}
                    role="listitem"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>
                    <p className="text-primary font-medium mb-2">{edu.degree}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{edu.date}</span>
                      <motion.span
                        className="bg-accent/20 px-2 py-0.5 rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        CGPA: {edu.gpa}
                      </motion.span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="p-3 rounded-xl bg-accent/10 text-accent-foreground shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <BookOpen className="h-6 w-6" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold">Publications</h2>
              </div>

              <div className="space-y-4" role="list" aria-label="Publications">
                {resumeData.publications.map((pub, index) => (
                  <motion.a
                    key={index}
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{
                      y: -5,
                      scale: 1.02,
                      borderColor: "rgba(129, 140, 248, 0.5)",
                    }}
                    className="block bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <h3 className="font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{pub.publisher}</span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {pub.date}
                      </span>
                    </div>
                    <motion.div
                      className="mt-3 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
