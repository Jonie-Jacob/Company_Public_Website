"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']";

export default function CustomCursor() {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const prefersReducedMotion = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const disabled = isTouchDevice || prefersReducedMotion || lowEnd;
  const crystalRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { damping: 28, stiffness: 420 });
  const y = useSpring(mouseY, { damping: 28, stiffness: 420 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY],
  );

  const onMouseOver = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) {
      crystalRef.current?.classList.add("cursor-hover");
    }
  }, []);

  const onMouseOut = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(INTERACTIVE)) {
      crystalRef.current?.classList.remove("cursor-hover");
    }
  }, []);

  useEffect(() => {
    if (disabled) return;

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
  }, [disabled, onMouseMove, onMouseOver, onMouseOut]);

  if (disabled) return null;

  return (
    <motion.div
      ref={crystalRef}
      className="cursor-crystal"
      style={{ x, y }}
      aria-hidden="true"
    >
      {/* Sapphire crystal — triangular faceted shape */}
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-crystal-svg"
      >
        <defs>
          {/* Main sapphire gradient */}
          <linearGradient id="sapphire-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          {/* Specular highlight */}
          <linearGradient id="sapphire-highlight" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Main crystal body */}
        <polygon
          points="11,0 22,20 0,20"
          fill="url(#sapphire-fill)"
        />
        {/* Inner facet — left */}
        <polygon
          points="11,0 6,14 11,20"
          fill="url(#sapphire-highlight)"
          opacity="0.4"
        />
        {/* Inner facet — right edge */}
        <polygon
          points="11,0 16,14 11,20"
          fill="rgba(99,102,241,0.25)"
        />
        {/* Bottom tip extension */}
        <polygon
          points="6,20 11,26 16,20"
          fill="url(#sapphire-fill)"
        />
        {/* Specular edge highlight */}
        <line
          x1="11" y1="0" x2="6" y2="14"
          stroke="rgba(196,181,253,0.6)"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
}
