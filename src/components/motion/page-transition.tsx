"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion/motion-config";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
