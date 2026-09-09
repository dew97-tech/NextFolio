"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";

interface ScrollAnimationConfig {
  inputRange?: number[];
  outputRange?: number[];
  offset?: [string, string];
}

interface ScrollAnimationValues {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement | null>,
  config: ScrollAnimationConfig = {}
): ScrollAnimationValues {
  const { reducedMotion } = usePhysics();

  const {
    inputRange = [0, 0.2, 0.8, 1],
    outputRange = [0, 1, 1, 0],
    offset = ["start end", "end start"],
  } = config;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as [any, any],
  });

  if (reducedMotion) {
    const staticValue = {
      get: () => 1,
      getVelocity: () => 0,
    } as MotionValue<number>;

    return {
      opacity: staticValue,
      y: staticValue,
      scale: staticValue,
      rotate: staticValue,
      scrollYProgress,
    };
  }

  const opacity = useTransform(scrollYProgress, inputRange, outputRange);
  const y = useTransform(scrollYProgress, inputRange, [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, inputRange, [0.8, 1, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, inputRange, [-5, 0, 0, 5]);

  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

  return {
    opacity: springOpacity,
    y: springY,
    scale: springScale,
    rotate: springRotate,
    scrollYProgress,
  };
}

interface ParallaxConfig {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  config: ParallaxConfig = {}
): MotionValue<number> {
  const { reducedMotion } = usePhysics();
  const { speed = 0.5, direction = "up" } = config;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  if (reducedMotion) {
    return {
      get: () => 0,
      getVelocity: () => 0,
    } as MotionValue<number>;
  }

  const distance = 100 * speed;
  const multiplier = direction === "up" || direction === "left" ? -1 : 1;

  const outputRange =
    direction === "up" || direction === "down"
      ? [distance * multiplier, -distance * multiplier]
      : [distance * multiplier, -distance * multiplier];

  return useTransform(scrollYProgress, [0, 1], outputRange);
}

export function useScrollVelocity(): MotionValue<number> {
  const { scrollVelocity } = usePhysics();
  return scrollVelocity;
}
