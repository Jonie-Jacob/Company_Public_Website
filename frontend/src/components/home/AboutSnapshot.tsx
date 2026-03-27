"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─── Animated sapphire crystal visual ─── */

function CrystalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.4"],
  });

  /* Scroll-linked entrance — container slides from right + fades in */
  const containerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const containerX = useTransform(scrollYProgress, [0, 1], [60, 0]);

  /* Scroll-linked entrance — crystal SVG scales up + rotates */
  const crystalScale = useTransform(scrollYProgress, [0.1, 1], [0.6, 1]);
  const crystalRotate = useTransform(scrollYProgress, [0.1, 1], [-10, 0]);

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center w-full h-full min-h-[380px] overflow-hidden"
      style={{ opacity: containerOpacity, x: containerX }}
    >
      {/* Ambient glow behind crystal */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(123,47,190,0.4) 0%, rgba(123,47,190,0) 70%)" }}
        animate={inView ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : { scale: 0.6, opacity: 0 }}
        transition={inView ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute w-[240px] h-[240px] rounded-full translate-x-6 translate-y-4"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 70%)" }}
        animate={inView ? { scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] } : { scale: 0.6, opacity: 0 }}
        transition={inView ? { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        aria-hidden="true"
      />

      {/* Main crystal SVG */}
      <motion.svg
        width="240"
        height="300"
        viewBox="0 0 240 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{
          filter: "drop-shadow(0 0 24px rgba(99,102,241,0.5)) drop-shadow(0 0 60px rgba(139,92,246,0.3))",
          scale: crystalScale,
          rotate: crystalRotate,
        }}
      >
        <defs>
          <linearGradient id="about-crystal-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="about-crystal-left" x1="0" y1="0.2" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="about-crystal-right" x1="1" y1="0.2" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="about-crystal-shine" x1="0.2" y1="0" x2="0.8" y2="0.6">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
          </linearGradient>
          <clipPath id="about-diamond-clip">
            <polygon points="120,12 208,118 120,280 32,118" />
          </clipPath>
          <linearGradient id="about-shimmer-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Top face — brightest */}
        <polygon points="120,12 32,118 120,140 208,118" fill="url(#about-crystal-body)" />

        {/* Bottom-left face */}
        <polygon points="32,118 120,140 120,280" fill="url(#about-crystal-left)" />

        {/* Bottom-right face — darker for depth */}
        <polygon points="208,118 120,140 120,280" fill="url(#about-crystal-right)" />

        {/* Inner facet — highlight on left */}
        <polygon points="120,12 76,86 120,140" fill="url(#about-crystal-shine)" opacity="0.6" />

        {/* Inner facet — shadow on right */}
        <polygon points="120,12 164,86 120,140" fill="rgba(99,102,241,0.3)" />

        {/* Specular edge lines — bright and visible */}
        <line x1="120" y1="12" x2="32" y2="118" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.7" />
        <line x1="120" y1="12" x2="208" y2="118" stroke="#a5b4fc" strokeWidth="1" opacity="0.5" />
        <line x1="32" y1="118" x2="120" y2="140" stroke="#c4b5fd" strokeWidth="1" opacity="0.6" />
        <line x1="208" y1="118" x2="120" y2="140" stroke="#a5b4fc" strokeWidth="1" opacity="0.4" />
        <line x1="120" y1="140" x2="120" y2="280" stroke="#c4b5fd" strokeWidth="1" opacity="0.35" />
        <line x1="32" y1="118" x2="208" y2="118" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.3" />

        {/* Bright specular flare on top edge */}
        <line x1="120" y1="12" x2="76" y2="86" stroke="#e0e7ff" strokeWidth="1" opacity="0.8" />

        {/* Shimmer sweep clipped to diamond */}
        <g clipPath="url(#about-diamond-clip)">
          <motion.rect
            width="60"
            height="400"
            y="-50"
            fill="url(#about-shimmer-grad)"
            style={{ transform: "rotate(-20deg)", transformOrigin: "120px 150px" }}
            initial={{ x: -80, opacity: 0 }}
            animate={inView ? { x: [-80, 320], opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          />
        </g>
      </motion.svg>



      {/* Floating sparkle particles */}
      {[
        { x: "18%", y: "22%", delay: 0, size: "w-2 h-2" },
        { x: "78%", y: "12%", delay: 0.8, size: "w-1.5 h-1.5" },
        { x: "82%", y: "68%", delay: 1.6, size: "w-2 h-2" },
        { x: "12%", y: "72%", delay: 2.4, size: "w-1.5 h-1.5" },
        { x: "50%", y: "5%", delay: 0.4, size: "w-1 h-1" },
        { x: "55%", y: "85%", delay: 3, size: "w-1 h-1" },
      ].map((spark, i) => (
        <motion.div
          key={i}
          className={`absolute ${spark.size} rounded-full`}
          style={{
            left: spark.x,
            top: spark.y,
            background: "radial-gradient(circle, #c4b5fd, #818cf8)",
            boxShadow: "0 0 6px 2px rgba(196,181,253,0.5)",
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.3, 0.3],
          }}
          transition={{
            duration: 3,
            delay: spark.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      ))}
    </motion.div>
  );
}

/* ─── Text column with staggered scroll-linked entrance ─── */

function TextColumn() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  /* Staggered scroll-linked transforms for 4 content items */
  const s = 0.13;
  const d = 0.30;
  const o0 = useTransform(scrollYProgress, [0, d], [0, 1]);
  const x0 = useTransform(scrollYProgress, [0, d], [-50, 0]);
  const o1 = useTransform(scrollYProgress, [s, s + d], [0, 1]);
  const x1 = useTransform(scrollYProgress, [s, s + d], [-50, 0]);
  const o2 = useTransform(scrollYProgress, [s * 2, s * 2 + d], [0, 1]);
  const x2 = useTransform(scrollYProgress, [s * 2, s * 2 + d], [-50, 0]);
  const o3 = useTransform(scrollYProgress, [s * 3, s * 3 + d], [0, 1]);
  const x3 = useTransform(scrollYProgress, [s * 3, s * 3 + d], [-50, 0]);

  return (
    <div ref={ref} className="order-2 md:order-1">
      <motion.p
        style={{ opacity: o0, x: x0 }}
        className="text-purple-light text-sm font-semibold tracking-[0.2em] uppercase mb-4"
      >
        About Zyphr
      </motion.p>

      <motion.h2
        style={{ opacity: o1, x: x1 }}
        className="gradient-text-bright text-3xl sm:text-4xl md:text-5xl font-bold
                   font-[family-name:var(--font-heading)] leading-tight mb-6"
      >
        Who We Are
      </motion.h2>

      <motion.div style={{ opacity: o2, x: x2 }}>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4">
          Zyphr is a technology company born from a belief that every idea
          — no matter how ambitious — deserves to become reality.
        </p>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
          We walk hand in hand with our customers, turning challenges into
          achievements and visions into lasting digital legacies.
        </p>
      </motion.div>

      <motion.div style={{ opacity: o3, x: x3 }}>
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-purple-light font-semibold
                     hover:text-champagne transition-colors duration-300"
          data-cursor="pointer"
        >
          Learn More About Us
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            &rarr;
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── About Snapshot Section ─── */

export default function AboutSnapshot() {
  return (
    <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.03] to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text — left side */}
        <TextColumn />

        {/* Visual — right side */}
        <div className="order-1 md:order-2">
          <CrystalVisual />
        </div>
      </div>
    </section>
  );
}
