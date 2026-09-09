"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxLayer({
  children,
  className = "",
  speed = 1,
  direction = "up",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = usePhysics();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
  );

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y: springY }} className={className}>
      {children}
    </motion.div>
  );
}

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxContainer({ children, className = "" }: ParallaxContainerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface DepthLayerProps {
  children: ReactNode;
  className?: string;
  depth?: "background" | "content" | "foreground" | "floating";
}

export function DepthLayer({
  children,
  className = "",
  depth = "content",
}: DepthLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, mouseX, mouseY } = usePhysics();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const depthConfig = {
    background: { speed: 0.2, zIndex: -1 },
    content: { speed: 1, zIndex: 0 },
    foreground: { speed: 1.5, zIndex: 10 },
    floating: { speed: 2, zIndex: 20 },
  };

  const config = depthConfig[depth];

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * config.speed, -50 * config.speed]
  );

  const mouseXValue = useTransform(mouseX, [0, 1920], [-10 * config.speed, 10 * config.speed]);
  const mouseYValue = useTransform(mouseY, [0, 1080], [-10 * config.speed, 10 * config.speed]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springMouseX = useSpring(mouseXValue, { stiffness: 150, damping: 50 });
  const springMouseY = useSpring(mouseYValue, { stiffness: 150, damping: 50 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        y: springY,
        x: depth !== "content" ? springMouseX : 0,
        translateY: depth !== "content" ? springMouseY : 0,
        zIndex: config.zIndex,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  backgroundElement?: ReactNode;
  foregroundElement?: ReactNode;
}

export function ParallaxSection({
  children,
  className = "",
  backgroundElement,
  foregroundElement,
}: ParallaxSectionProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {backgroundElement && (
        <DepthLayer depth="background" className="absolute inset-0 pointer-events-none">
          {backgroundElement}
        </DepthLayer>
      )}

      <DepthLayer depth="content" className="relative z-10">
        {children}
      </DepthLayer>

      {foregroundElement && (
        <DepthLayer depth="foreground" className="absolute inset-0 pointer-events-none z-20">
          {foregroundElement}
        </DepthLayer>
      )}
    </section>
  );
}
