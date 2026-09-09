"use client";

import { motion } from "framer-motion";
import { PageLoading } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <PageLoading />
    </motion.div>
  );
}
