"use client";

import { ReactNode, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  scale?: number;
  perspective?: number;
}

export function TiltCard({
  children,
  className = "",
  tiltAmount = 10,
  glareOpacity = 0.15,
  scale = 1.02,
  perspective = 1000,
}: TiltCardProps) {
  const { reducedMotion, isMobile } = usePhysics();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(x, [0, 1], [-tiltAmount, tiltAmount]);
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([latestX, latestY]) =>
      `radial-gradient(circle at ${latestX} ${latestY}, rgba(255,255,255,${glareOpacity}), transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;

    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseEnter = () => {
    if (!reducedMotion && !isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  };

  const shouldAnimate = !reducedMotion && !isMobile;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldAnimate ? springRotateX : 0,
        rotateY: shouldAnimate ? springRotateY : 0,
        transformStyle: shouldAnimate ? "preserve-3d" : "flat",
        perspective: shouldAnimate ? `${perspective}px` : "none",
      }}
      whileHover={shouldAnimate ? { scale } : {}}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`relative ${className}`}
    >
      {children}
      {shouldAnimate && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-inherit overflow-hidden"
          style={{
            background: glareBackground,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </motion.div>
  );
}

interface DepthCardProps {
  children: ReactNode;
  className?: string;
  layers?: { content: ReactNode; z: number }[];
}

export function DepthCard({ children, className = "", layers = [] }: DepthCardProps) {
  const { reducedMotion, isMobile } = usePhysics();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [5, -5]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

  const springConfig = { stiffness: 200, damping: 25 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const shouldAnimate = !reducedMotion && !isMobile;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldAnimate ? springRotateX : 0,
        rotateY: shouldAnimate ? springRotateY : 0,
        transformStyle: shouldAnimate ? "preserve-3d" : "flat",
      }}
      className={className}
    >
      {children}
      {shouldAnimate && layers.map((layer, index) => (
        <motion.div
          key={index}
          style={{
            transform: `translateZ(${layer.z}px)`,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {layer.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
