"use client";

import { ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePhysics } from "@/lib/motion/physics-context";
import Link from "next/link";

interface MagneticLinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "onClick" | "children"
  > {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export function MagneticLink({
  children,
  href,
  className = "",
  strength = 0.3,
  onClick,
  ...rest
}: MagneticLinkProps) {
  const { reducedMotion, isMobile } = usePhysics();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={href} passHref legacyBehavior={false} {...rest}>
      <motion.div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: reducedMotion || isMobile ? 0 : springX,
          y: reducedMotion || isMobile ? 0 : springY,
          display: "inline-block",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </Link>
  );
}
