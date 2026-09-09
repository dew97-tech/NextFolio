"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMotionValue, useScroll, useSpring, MotionValue } from "framer-motion";

interface WindowSize {
  width: number;
  height: number;
}

interface PhysicsContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  mouseXSpring: MotionValue<number>;
  mouseYSpring: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  windowSize: WindowSize;
  reducedMotion: boolean;
  isMobile: boolean;
}

const PhysicsContext = createContext<PhysicsContextType | null>(null);

const springConfig = { damping: 25, stiffness: 700 };

export function PhysicsProvider({ children }: { children: ReactNode }) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 1200,
    height: 800,
  });
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useSpring(0, { damping: 30, stiffness: 200 });

  const isMobile = mounted ? windowSize.width < 768 : false;

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let lastScrollY = 0;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      const velocity = deltaTime > 0 ? (deltaScroll / deltaTime) * 1000 : 0;
      
      scrollVelocity.set(velocity);
      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY, scrollVelocity]);

  return (
    <PhysicsContext.Provider
      value={{
        mouseX,
        mouseY,
        mouseXSpring,
        mouseYSpring,
        scrollY,
        scrollYProgress,
        scrollVelocity,
        windowSize,
        reducedMotion,
        isMobile,
      }}
    >
      {children}
    </PhysicsContext.Provider>
  );
}

export function usePhysics() {
  const context = useContext(PhysicsContext);
  if (!context) {
    throw new Error("usePhysics must be used within a PhysicsProvider");
  }
  return context;
}
