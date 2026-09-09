"use client";

import { useRef, useState, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";

interface GlowingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GlowingInput({ 
  label, 
  error, 
  className = "", 
  ...props 
}: GlowingInputProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { reducedMotion, isMobile } = usePhysics();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        className="relative"
      >
        {!reducedMotion && !isMobile && (
          <motion.div
            className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: useTransform(
                [springX, springY],
                ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(161, 188, 152, 0.3), transparent 50%)`
              ),
              opacity: isFocused ? 1 : 0,
            }}
          />
        )}
        
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            relative w-full px-4 py-3 rounded-lg 
            bg-background/80 backdrop-blur-sm
            border border-border 
            focus:border-primary/50 focus:ring-2 focus:ring-primary/20
            outline-none transition-all duration-300
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
        />
      </motion.div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface GlowingTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function GlowingTextarea({ 
  label, 
  error, 
  className = "", 
  ...props 
}: GlowingTextareaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { reducedMotion, isMobile } = usePhysics();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        className="relative"
      >
        {!reducedMotion && !isMobile && (
          <motion.div
            className="absolute -inset-0.5 rounded-lg pointer-events-none"
            style={{
              background: useTransform(
                [springX, springY],
                ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(161, 188, 152, 0.3), transparent 50%)`
              ),
              opacity: isFocused ? 1 : 0,
            }}
          />
        )}
        
        <textarea
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            relative w-full px-4 py-3 rounded-lg 
            bg-background/80 backdrop-blur-sm
            border border-border 
            focus:border-primary/50 focus:ring-2 focus:ring-primary/20
            outline-none transition-all duration-300 resize-none
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
        />
      </motion.div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
