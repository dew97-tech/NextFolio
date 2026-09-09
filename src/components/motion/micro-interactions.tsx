"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { usePhysics } from "@/lib/motion/physics-context";

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrapper({ children, className = "", strength = 0.3 }: MagneticWrapperProps) {
  const { reducedMotion, isMobile } = usePhysics();

  if (reducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedUnderlineProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function AnimatedUnderline({ children, className = "", href }: AnimatedUnderlineProps) {
  const Wrapper = href ? motion.a : motion.span;

  return (
    <Wrapper
      href={href}
      className={`relative inline-block group ${className}`}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
        initial={{ scaleX: 0 }}
        variants={{
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </Wrapper>
  );
}

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HoverImage({ src, alt, className = "" }: HoverImageProps) {
  const { reducedMotion } = usePhysics();

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={reducedMotion ? {} : { scale: 1.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
}

export function GlowButton({ 
  children, 
  className = "", 
  onClick,
  variant = "primary" 
}: GlowButtonProps) {
  const { reducedMotion } = usePhysics();

  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden";
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/30",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      whileHover={reducedMotion ? {} : { y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        whileHover={{ translateX: "100%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  amplitude?: number;
}

export function FloatingElement({ 
  children, 
  className = "", 
  delay = 0,
  amplitude = 10 
}: FloatingElementProps) {
  const { reducedMotion } = usePhysics();

  return (
    <motion.div
      className={className}
      animate={reducedMotion ? {} : {
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function Reveal({ 
  children, 
  className = "", 
  direction = "up" 
}: RevealProps) {
  const { reducedMotion } = usePhysics();

  const directionOffset = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? {} : { 
        opacity: 0, 
        ...directionOffset[direction],
        filter: "blur(10px)",
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
