"use client";

import { resumeData } from "@/data/resume";
import { motion } from "framer-motion";
import { BookOpen, Code, GraduationCap } from "lucide-react";

export function Skills() {
  return (
    <section id="skills" className="py-20 bg-accent/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Skills Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">Technical Skills</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Languages & Frameworks</h3>
                <div className="flex flex-wrap gap-3">
                  {resumeData.skills.languagesAndFrameworks.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Methodologies</h3>
                <div className="flex flex-wrap gap-3">
                  {resumeData.skills.methodologies.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education & Publications Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Education */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-secondary/10 text-secondary-foreground">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Education</h2>
              </div>

              <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-xl border border-border shadow-sm"
                  >
                    <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>
                    <p className="text-primary font-medium mb-2">{edu.degree}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{edu.date}</span>
                      <span>CGPA: {edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Publications</h2>
              </div>

              <div className="space-y-4">
                {resumeData.publications.map((pub, index) => (
                  <a
                    key={index}
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                  >
                    <h3 className="font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{pub.publisher}</span>
                      <span>{pub.date}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
