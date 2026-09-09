"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export function usePerformanceMonitoring() {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("PerformanceObserver" in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metricsRef.current.fcp = entries[entries.length - 1].startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          metricsRef.current.lcp = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metricsRef.current.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const firstEntry = entries[0] as PerformanceEntry & { processingStart: number; startTime: number };
          metricsRef.current.fid = firstEntry.processingStart - firstEntry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navigation) {
        metricsRef.current.ttfb = navigation.responseStart - navigation.startTime;
      }

      const timeout = setTimeout(() => {
        console.log("📊 Performance Metrics:", metricsRef.current);
        
        if (metricsRef.current.fcp && metricsRef.current.fcp > 1800) {
          console.warn("⚠️ FCP is slow:", metricsRef.current.fcp);
        }
        if (metricsRef.current.lcp && metricsRef.current.lcp > 2500) {
          console.warn("⚠️ LCP is slow:", metricsRef.current.lcp);
        }
        if (metricsRef.current.cls && metricsRef.current.cls > 0.1) {
          console.warn("⚠️ CLS is high:", metricsRef.current.cls);
        }
      }, 5000);

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
        clearTimeout(timeout);
      };
    }
  }, []);

  return metricsRef.current;
}

export function useFPSMonitoring() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let warningCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        if (fps < 30) {
          warningCount++;
          if (warningCount <= 3) {
            console.warn(`⚠️ Low FPS detected: ${fps}`);
          }
        } else {
          warningCount = 0;
        }
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

export function checkPerformanceBudget() {
  if (typeof window === "undefined") return;

  const resources = performance.getEntriesByType("resource");
  let totalSize = 0;
  
  resources.forEach((resource) => {
    if ((resource as any).transferSize) {
      totalSize += (resource as any).transferSize;
    }
  });

  const totalSizeMB = totalSize / (1024 * 1024);
  
  if (totalSizeMB > 1) {
    console.warn(`⚠️ Bundle size is ${totalSizeMB.toFixed(2)}MB. Consider code splitting.`);
  }

  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
      console.warn(`⚠️ Large image detected: ${img.src}`);
    }
  });
}
