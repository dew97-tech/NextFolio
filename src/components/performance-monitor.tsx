"use client";

import { useEffect } from "react";
import { usePerformanceMonitoring, useFPSMonitoring, checkPerformanceBudget } from "@/lib/performance";

export function PerformanceMonitor() {
  usePerformanceMonitoring();
  useFPSMonitoring();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("load", checkPerformanceBudget);
      return () => window.removeEventListener("load", checkPerformanceBudget);
    }
  }, []);

  return null;
}
