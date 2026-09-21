"use client";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { KineticText } from "@/components/motion/split-text";
import { resumeData } from "@/data/resume";
import { usePhysics } from "@/lib/motion/physics-context";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { reducedMotion } = usePhysics();

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <motion.div
          className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
          animate={reducedMotion ? {} : {
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/12 rounded-full blur-[100px]"
          animate={reducedMotion ? {} : {
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[80px]"
          animate={reducedMotion ? {} : {
            scale: [1, 1.08, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.span
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(96, 165, 250, 0.2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new opportunities
          </motion.span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="block mb-2">
            <span className="text-foreground dark:text-[#e8ecf4]">
              <KineticText
                text="Hi, I'm"
                className="inline-block"
                delay={0.2}
                staggerDelay={0.03}
              />
            </span>
            <motion.span
              className="text-gradient inline-block ml-2 md:ml-3 cursor-default"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ scale: 1.02 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {resumeData.personal.name}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal"
        >
          A{" "}
          <span className="text-foreground font-semibold">
            {resumeData.personal.role}
          </span>{" "}
          focused on building dependable, scalable web applications with{" "}
          <span className="text-foreground font-semibold">Next.js</span> and{" "}
          <span className="text-foreground font-semibold">Laravel</span>, with practical experience in AI-powered workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 group shadow-lg shadow-primary/25 hover:shadow-primary/40 relative overflow-hidden"
          >
            <Link href="/#projects" className="flex items-center relative z-10">
              View Work
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
            />
          </MagneticButton>

          <MagneticButton
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-input bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300 font-medium shadow-lg hover:shadow-accent/20 relative overflow-hidden group"
          >
            <a
              href="/David_Mallick_CV.pdf"
              download="David_Mallick_CV.pdf"
              className="flex items-center relative z-10"
            >
              Download CV
              <motion.span
                className="ml-2"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Download className="h-4 w-4" />
              </motion.span>
            </a>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            className="relative"
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-2 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-primary/10 blur-md"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-1 h-2 bg-primary rounded-full relative z-10"
                animate={reducedMotion ? {} : {
                  y: [0, 12, 0],
                  opacity: [1, 0.3, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground mt-2 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Scroll
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
