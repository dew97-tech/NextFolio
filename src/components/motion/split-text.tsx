"use client";

import { motion, Variants } from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: "chars" | "words" | "lines";
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  type = "words",
  staggerDelay = 0.05,
  as: Component = "span",
}: SplitTextProps) {
  const { reducedMotion } = usePhysics();

  if (reducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const items =
    type === "chars"
      ? text.split("")
      : type === "words"
      ? text.split(" ")
      : text.split("\n");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={className}
      style={{
        display: "inline-block",
        perspective: "1000px",
      }}
      aria-label={text}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{
            display: "inline-block",
            marginRight: type === "words" ? "0.25em" : "0",
            whiteSpace: type === "chars" ? "pre" : "normal",
            transformStyle: "preserve-3d",
          }}
        >
          {item || "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  hoverEffect?: boolean;
}

export function KineticText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
  hoverEffect = true,
}: KineticTextProps) {
  const { reducedMotion } = usePhysics();
  const chars = text.split("");

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hover: hoverEffect
      ? {
          y: -4,
          scale: 1.06,
          transition: { type: "spring", damping: 12, stiffness: 300 },
        }
      : {},
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={className}
      style={{
        display: "inline-block",
        perspective: "1000px",
        cursor: hoverEffect ? "default" : "inherit",
      }}
      aria-label={text}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            transformStyle: "preserve-3d",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
