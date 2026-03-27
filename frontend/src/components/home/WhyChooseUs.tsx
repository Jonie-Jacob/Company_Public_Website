"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DIFFERENTIATORS } from "@/lib/constants";

/* ─── Icon map ─── */

const iconPaths: Record<string, ReactNode> = {
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  ),
  handshake: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3.15m3.15-3.15v-1.362a1.575 1.575 0 0 1 3.15 0v1.362m-3.15 0a1.575 1.575 0 0 1 3.15 0m-3.15 0V13.5m3.15-10.288a1.575 1.575 0 0 1 3.15 0V6.3m-3.15-3.075v8.775m3.15-8.775V13.5m0-7.2a1.575 1.575 0 0 1 3.15 0V9.45m-3.15-3.15v6.075m3.15-6.075v8.625c0 1.036-.84 1.875-1.875 1.875h-3.87a1.875 1.875 0 0 1-1.327-.55L6.3 14.691a2.079 2.079 0 0 1 2.942-2.942l.992.992m0 0V4.575"
    />
  ),
  rocket: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a48.414 48.414 0 0 1-6.18 0c.19.747.302 1.527.302 2.33a7.005 7.005 0 0 1-2.463 5.336 1 1 0 0 1-.67.264H3.75a.75.75 0 0 1-.67-1.085l2.108-4.215A48.394 48.394 0 0 1 3 8.625c0-3.36.81-6.537 2.25-9.338a1 1 0 0 1 .894-.537h5.712a1 1 0 0 1 .894.537A19.724 19.724 0 0 1 15 8.625c0 2.011-.313 3.956-.89 5.78l.48-.03ZM15.59 14.37a1 1 0 0 1 .894.553l2.108 4.215a.75.75 0 0 1-.67 1.085H15a1 1 0 0 1-.67-.264 7.005 7.005 0 0 1-2.463-5.336c0-.803.112-1.583.302-2.33m3.421.077ZM12 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
    />
  ),
  "check-circle": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  ),
  layers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0L21.75 12l-4.179 2.25m0 0L12 17.25l-5.571-3m11.142 0L21.75 16.5 12 21.75 2.25 16.5l4.179-2.25"
    />
  ),
  infinity: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  ),
};

/* ─── Single differentiator item ─── */

function DifferentiatorItem({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -40 : 40, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="group flex items-start gap-5 p-6 rounded-2xl
                 transition-colors duration-300 hover:bg-white/[0.03]"
    >
      {/* Icon */}
      <div className="relative shrink-0">
        <div
          className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, var(--color-purple) 0%, var(--color-ceylon-blue) 100%)",
          }}
        />
        <div
          className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-purple/30
                     bg-purple/10 transition-all duration-500 group-hover:bg-purple/20 group-hover:border-purple/50
                     group-hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-purple-light transition-colors duration-300 group-hover:text-champagne"
          >
            {iconPaths[icon] ?? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary font-[family-name:var(--font-heading)] mb-1.5 transition-colors duration-300 group-hover:text-champagne">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Section heading ─── */

function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="text-center mb-16">
      <p className="text-purple-light text-sm font-semibold tracking-[0.2em] uppercase mb-4">
        The Zyphr Difference
      </p>
      <h2 className="gradient-text-bright text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight">
        Why Zyphr?
      </h2>
    </motion.div>
  );
}

/* ─── Why Choose Us Section ─── */

export default function WhyChooseUs() {
  return (
    <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.02] to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <SectionHeader />

        {/* 2-column grid of differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {DIFFERENTIATORS.map((item, index) => (
            <DifferentiatorItem
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
