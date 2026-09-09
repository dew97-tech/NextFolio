"use client";

import { usePhysics } from "@/lib/motion/physics-context";
import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const { windowSize, isMobile, reducedMotion } = usePhysics();
  const mouseRef = useRef({ x: 0, y: 0 });

  const colors = [
    'rgba(96, 165, 250, ',
    'rgba(129, 140, 248, ',
    'rgba(34, 211, 238, ',
    'rgba(96, 165, 250, ',
  ];

  const getParticleCount = useCallback(() => {
    if (isMobile) return 60;
    if (windowSize.width < 1024) return 100;
    return 150;
  }, [isMobile, windowSize.width]);

  const initParticles = useCallback(() => {
    const count = getParticleCount();
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: (Math.random() * 2 + 1) * 2,
        opacity: (Math.random() * 0.15 + 0.03),
        color,
      });
    }

    particlesRef.current = particles;
  }, [getParticleCount, windowSize]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (isMobile && frameCount % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        if (!isMobile || i % 3 === 0) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 120;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.vx -= (dx / distance) * force * 0.015;
            particle.vy -= (dy / distance) * force * 0.015;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.995;
        particle.vy *= 0.995;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${particle.opacity})`;
        ctx.fill();

        if (particle.radius > 2.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `${particle.color}${particle.opacity * 0.3})`;
          ctx.fill();
        }
      });

      const maxConnections = isMobile ? 1 : 2;
      const connectionDistance = isMobile ? 80 : 100;

      for (let i = 0; i < particles.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            connections++;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, windowSize, isMobile, reducedMotion]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = windowSize.width;
      canvasRef.current.height = windowSize.height;
      initParticles();
    }
  }, [windowSize, initParticles]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
