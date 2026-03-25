"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE_SELECTORS = "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']";

export default function CustomCursor() {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const prefersReducedMotion = useReducedMotion();
  const isHovering = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const dotX = useSpring(mouseX, { damping: 35, stiffness: 400 });
  const dotY = useSpring(mouseY, { damping: 35, stiffness: 400 });
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY],
  );

  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTORS)) {
      isHovering.current = true;
      dotRef.current?.classList.add("cursor-hover");
      ringRef.current?.classList.add("cursor-hover");
    }
  }, []);

  const onMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTORS)) {
      isHovering.current = false;
      dotRef.current?.classList.remove("cursor-hover");
      ringRef.current?.classList.remove("cursor-hover");
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    document.documentElement.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isTouchDevice, prefersReducedMotion, onMouseMove, onMouseOver, onMouseOut]);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      />
      {/* Outer ring */}
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      />
    </AnimatePresence>
  );
}
