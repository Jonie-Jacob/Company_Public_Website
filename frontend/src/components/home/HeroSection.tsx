"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ─── Particle canvas ─── */

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  pulse: number;
}

function createParticles(w: number, h: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.2,
    pulse: Math.random() * Math.PI * 2,
  }));
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animId = useRef(0);
  const reducedMotion = useReducedMotion();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles.current) {
      if (!reducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      const flicker = 0.5 + 0.5 * Math.sin(p.pulse);
      const a = p.alpha * flicker;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${a})`;
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${a * 0.15})`;
      ctx.fill();
    }

    animId.current = requestAnimationFrame(draw);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      particles.current = createParticles(rect.width, rect.height, 80);
    };

    resize();
    animId.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ─── "Z" watermark ─── */

function ZWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <span
        className="text-[28rem] md:text-[36rem] font-bold font-[family-name:var(--font-heading)] leading-none
                   bg-gradient-to-br from-purple/8 to-ceylon-blue/5 bg-clip-text text-transparent
                   drop-shadow-[0_0_80px_rgba(168,85,247,0.08)]"
        aria-hidden="true"
      >
        Z
      </span>
    </div>
  );
}

/* ─── Scroll indicator ─── */

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <span className="text-xs text-text-muted tracking-widest uppercase">Scroll</span>
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-light"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </motion.div>
  );
}

/* ─── Hero Section ─── */

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: particles layer moves faster, watermark slightly
  const particleY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Text animation variants
  const ease = [0.4, 0, 0.2, 1] as const;

  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease },
    },
  };

  const subheadlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.6, ease },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[72px] pt-[72px]"
    >
      {/* ── Gradient background ── */}
      <div
        className="absolute inset-0 gradient-brand-diagonal"
        aria-hidden="true"
      />

      {/* ── Subtle radial glow accents ── */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full
                   bg-purple/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full
                   bg-ceylon-blue/10 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Particles (parallax layer) ── */}
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y: particleY }}
        aria-hidden="true"
      >
        <ParticleCanvas />
      </motion.div>

      {/* ── Z watermark (parallax layer) ── */}
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { y: watermarkY }}
        aria-hidden="true"
      >
        <ZWatermark />
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Glassmorphism overlay behind text */}
        <div
          className="absolute -inset-8 md:-inset-12 rounded-3xl
                     bg-near-black/20 backdrop-blur-sm
                     border border-white/5"
          aria-hidden="true"
        />

        <motion.h1
          className="relative gradient-text-bright text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                     font-bold font-[family-name:var(--font-heading)]
                     leading-tight tracking-tight mb-6"
          variants={reducedMotion ? undefined : headlineVariants}
          initial="hidden"
          animate="visible"
        >
          Empowering Dreams.
          <br />
          Engineering Reality.
        </motion.h1>

        <motion.p
          className="relative text-base sm:text-lg md:text-xl text-text-secondary
                     max-w-2xl leading-relaxed mb-10"
          variants={reducedMotion ? undefined : subheadlineVariants}
          initial="hidden"
          animate="visible"
        >
          We craft innovative software solutions that transform bold ideas
          into digital experiences — from concept to cloud.
        </motion.p>

        <motion.div
          className="relative flex flex-col sm:flex-row items-center gap-4"
          variants={reducedMotion ? undefined : ctaVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Primary CTA */}
          <Link
            href="/contact"
            className="group relative px-8 py-3.5 rounded-full text-white font-semibold
                       gradient-brand
                       shadow-[0_0_25px_rgba(168,85,247,0.3)]
                       hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]
                       transition-shadow duration-300
                       focus-ring"
            data-cursor="pointer"
          >
            <span className="relative z-10">Start Your Journey</span>
            {/* Glow pulse */}
            <span
              className="absolute inset-0 rounded-full gradient-brand opacity-0
                         group-hover:opacity-50 blur-xl transition-opacity duration-500"
              aria-hidden="true"
            />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/services"
            className="px-8 py-3.5 rounded-full font-semibold
                       border border-purple-light/40 text-purple-light
                       hover:bg-purple-light/10 hover:border-purple-light/60
                       transition-colors duration-300
                       focus-ring"
            data-cursor="pointer"
          >
            Explore Our Services
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <ScrollIndicator />
    </section>
  );
}
