"use client";

import { usePhysics } from "@/lib/motion/physics-context";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorTrail() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { reducedMotion, isMobile } = usePhysics();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useSpring(cursorX, { damping: 30, stiffness: 200 });
  const dotY = useSpring(cursorY, { damping: 30, stiffness: 200 });

  const scale = useSpring(1, { damping: 20, stiffness: 300 });
  const opacity = useSpring(1, { damping: 20, stiffness: 300 });

  const dot2X = useSpring(dotX, { damping: 40, stiffness: 150 });
  const dot2Y = useSpring(dotY, { damping: 40, stiffness: 150 });

  const dot1Opacity = useTransform(opacity, (v) => v * 0.6);
  const dot2Opacity = useTransform(opacity, (v) => v * 0.3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || reducedMotion || isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const isPointerCursor = computedStyle.cursor === "pointer";
      const isTextCursor = computedStyle.cursor === "text";

      setIsPointer(isPointerCursor);
      setIsHovering(isPointerCursor || isTextCursor);

      if (isPointerCursor) {
        scale.set(1.8);
      } else if (isTextCursor) {
        scale.set(0.7);
      } else {
        scale.set(1);
      }
    };

    const handleMouseEnter = () => {
      opacity.set(1);
    };

    const handleMouseLeave = () => {
      opacity.set(0);
    };

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, mounted, reducedMotion, isMobile, scale, opacity]);

  if (!mounted || reducedMotion || isMobile) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-primary pointer-events-none z-[100] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale,
          opacity,
        }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-md"
          animate={{
            scale: isHovering ? 1.3 : 1,
            opacity: isHovering ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary pointer-events-none z-[99] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          opacity: dot1Opacity,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-secondary/70 pointer-events-none z-[98] hidden md:block"
        style={{
          x: dot2X,
          y: dot2Y,
          opacity: dot2Opacity,
        }}
        aria-hidden="true"
      />
    </>
  );
}
