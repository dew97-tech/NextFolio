"use client";

import { resumeData } from "@/data/resume";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-accent/5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2" />

          {resumeData.experience.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative mb-12 md:mb-20 ${
                index % 2 === 0 ? "md:text-right" : "md:text-left"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background transform -translate-x-[7px] md:-translate-x-1/2 mt-1.5 z-10" />

              <div
                className={`pl-8 md:pl-0 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                } grid md:grid-cols-2 gap-4 md:gap-0`}
              >
                {/* Content Positioning */}
                <div className={index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"}>
                  <div className="bg-card p-6 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary mb-1">{job.role}</h3>
                    <h4 className="text-lg font-semibold mb-2">{job.company}</h4>
                    
                    <div className={`flex flex-wrap gap-3 text-sm text-muted-foreground mb-4 ${
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{job.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {job.promotions && (
                      <div className="mb-4 p-3 bg-accent/10 rounded-lg text-sm">
                        <p className="font-semibold">Previous Role:</p>
                        {job.promotions.map((promo, i) => (
                          <div key={i} className="flex justify-between items-center mt-1">
                            <span>{promo.role}</span>
                            <span className="text-muted-foreground text-xs">{promo.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      {job.projects.map((project, pIndex) => (
                        <div key={pIndex} className="text-left">
                          <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            {project.name}
                          </h5>
                          <p className="text-sm text-muted-foreground mt-1 mb-2">
                            {project.description}
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground/90">
                            {project.achievements.slice(0, 3).map((achievement, aIndex) => (
                              <li key={aIndex}>{achievement}</li>
                            ))}
                            {project.achievements.length > 3 && (
                              <li className="list-none text-primary text-xs pt-1 italic">
                                + {project.achievements.length - 3} more achievements...
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
