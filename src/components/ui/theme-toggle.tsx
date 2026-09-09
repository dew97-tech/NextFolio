"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { usePhysics } from "@/lib/motion/physics-context";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const { reducedMotion } = usePhysics();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="relative p-2 rounded-full hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {isAnimating && !reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full bg-background"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 2], 
              opacity: [0, 1, 0] 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.4,
              times: [0, 0.5, 1],
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              background: isDark 
                ? "radial-gradient(circle, rgba(253, 255, 226, 0.5) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(10, 14, 23, 0.5) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ 
          duration: reducedMotion ? 0 : 0.3,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={reducedMotion ? {} : { 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <Sun className="h-5 w-5 text-amber-500" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ 
          duration: reducedMotion ? 0 : 0.3,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="flex items-center justify-center"
      >
        <motion.div
          animate={reducedMotion ? {} : { 
            rotate: [0, -10, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Moon className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: theme === "dark" 
            ? "0 0 20px rgba(161, 188, 152, 0.3)"
            : "0 0 20px rgba(255, 193, 7, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
