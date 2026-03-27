"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const offsets = {
  left: { x: -60, y: 0 },
  right: { x: 60, y: 0 },
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
  amount = 0.3,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });
  const offset = offsets[direction];

  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollX = useTransform(scrollYProgress, [0, 1], [offset.x, 0]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [offset.y, 0]);

  /* Scroll-linked mode: animation progress tied directly to scroll position */
  if (!once) {
    return (
      <motion.div ref={ref} className={className} style={{ opacity: scrollOpacity, x: scrollX, y: scrollY }}>
        {children}
      </motion.div>
    );
  }

  /* Time-based mode: animation triggers once when element enters viewport */
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
