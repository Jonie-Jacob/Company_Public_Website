"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']";

const TRAIL_COUNT = 8;
const TRAIL_MS = 40;

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const prefersReducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: -100, y: -100 });
  const trailId = useRef(0);

  const [trail, setTrail] = useState<TrailDot[]>([]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 450 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 450 });
  const ringX = useSpring(mouseX, { damping: 20, stiffness: 250, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 250, mass: 0.6 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [mouseX, mouseY],
  );

  const onMouseOver = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) {
      dotRef.current?.classList.add("cursor-hover");
      ringRef.current?.classList.add("cursor-hover");
    }
  }, []);

  const onMouseOut = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) {
      dotRef.current?.classList.remove("cursor-hover");
      ringRef.current?.classList.remove("cursor-hover");
    }
  }, []);

  /* Main cursor listeners */
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

  /* Trail — snapshot position every TRAIL_MS */
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const id = setInterval(() => {
      const { x, y } = lastPos.current;
      if (x === -100 && y === -100) return;
      trailId.current += 1;
      const dotId = trailId.current;
      setTrail((prev) => [
        ...prev.slice(-(TRAIL_COUNT - 1)),
        { id: dotId, x, y },
      ]);
    }, TRAIL_MS);

    return () => clearInterval(id);
  }, [isTouchDevice, prefersReducedMotion]);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      {/* Trailing glow dots */}
      <AnimatePresence>
        {trail.map((dot, i) => {
          const age = (i + 1) / trail.length;
          return (
            <motion.div
              key={dot.id}
              className="cursor-trail"
              style={{ left: dot.x, top: dot.y }}
              initial={{ opacity: 0.5, scale: 0.7 }}
              animate={{ opacity: 0.05 + age * 0.25, scale: 0.3 + age * 0.5 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          );
        })}
      </AnimatePresence>

      {/* Inner dot (follows mouse tightly) */}
      <motion.div
        ref={dotRef}
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
      />

      {/* Outer ring (lags slightly for parallax feel) */}
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
      />
    </>
  );
}
