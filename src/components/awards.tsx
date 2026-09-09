"use client";

import { TiltCard } from "@/components/motion/tilt-card";
import { resumeData } from "@/data/resume";
import { usePhysics } from "@/lib/motion/physics-context";
import { motion } from "framer-motion";
import { Award, Star, Trophy } from "lucide-react";

const icons = [Trophy, Star, Award];

export function Awards() {
  const { reducedMotion } = usePhysics();

  return (
    <section
      id="awards"
      className="py-20 relative overflow-hidden"
      aria-labelledby="awards-heading"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"
        animate={reducedMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-4"
          >
            <Trophy className="h-4 w-4" />
            Recognition
          </motion.span>
          <h2 id="awards-heading" className="text-3xl md:text-5xl font-bold mb-4">Honors & Awards</h2>
          <motion.div
            className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" role="list" aria-label="Awards and achievements">
          {resumeData.awards.map((award, index) => {
            const IconComponent = icons[index % icons.length];

            return (
              <motion.article
                key={index}
                role="listitem"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
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
                  tiltAmount={5}
                  glareOpacity={0.1}
                >
                  <motion.div
                    className="bg-card/90 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 flex gap-4 items-start h-full group relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      aria-hidden="true"
                    />

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      aria-hidden="true"
                    />

                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-500 flex-shrink-0 shadow-lg relative z-10"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{
                        scale: { type: "spring", stiffness: 400, damping: 10 },
                        rotate: { duration: 0.4, ease: "easeInOut" },
                      }}
                      aria-hidden="true"
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>

                    <div className="relative z-10">
                      <motion.h3
                        className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300"
                      >
                        {award.title}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {award.description}
                      </p>
                    </div>

                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500/50"
                      animate={reducedMotion ? {} : {
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      aria-hidden="true"
                    />
                  </motion.div>
                </TiltCard>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
