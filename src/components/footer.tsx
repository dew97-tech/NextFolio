"use client";

import { MagneticLink } from "@/components/motion/magnetic-link";
import { resumeData } from "@/data/resume";
import { usePhysics } from "@/lib/motion/physics-context";
import { motion } from "framer-motion";
import { ArrowUp, Github, Heart, Linkedin, Mail, Sparkles } from "lucide-react";

export function Footer() {
  const { reducedMotion } = usePhysics();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="bg-background/80 backdrop-blur-sm border-t border-border py-12 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      <motion.div
        className="absolute -bottom-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-10 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"
        animate={reducedMotion ? {} : {
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center md:justify-start">
            <span>&copy; {new Date().getFullYear()} {resumeData.personal.name}.</span>
            <span className="hidden sm:inline">Made with</span>
            <motion.span
              animate={reducedMotion ? {} : { scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-flex items-center gap-1"
            >
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span className="hidden sm:inline">and</span>
            </motion.span>
            <span className="inline-flex items-center gap-1 text-cyan-400">
              <Sparkles className="h-3 w-3" />
              <span>passion</span>
            </span>
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          role="navigation"
          aria-label="Social media links"
        >
          <MagneticLink
            href={resumeData.personal.github}
            strength={0.4}
            className="text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-md p-1"
            aria-label={`GitHub profile (opens in new tab)`}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5" />
            </motion.div>
          </MagneticLink>
          <MagneticLink
            href={resumeData.personal.linkedin}
            strength={0.4}
            className="text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-md p-1"
            aria-label={`LinkedIn profile (opens in new tab)`}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="h-5 w-5" />
            </motion.div>
          </MagneticLink>
          <MagneticLink
            href={`mailto:${resumeData.personal.email}`}
            strength={0.4}
            className="text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-md p-1"
            aria-label={`Email ${resumeData.personal.email}`}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="h-5 w-5" />
            </motion.div>
          </MagneticLink>
        </motion.div>

        <motion.button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-accent/20 text-primary hover:bg-accent/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-label="Scroll to top"
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </div>
    </footer>
  );
}
