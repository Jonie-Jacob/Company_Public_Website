"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SHOW_PORTFOLIO } from "@/lib/config";

/* ── placeholder project data ── */
const PROJECTS = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    gradient: "from-purple to-ceylon-blue",
  },
  {
    title: "FinTech Dashboard",
    category: "UI/UX Design",
    gradient: "from-ceylon-blue to-purple-light",
  },
  {
    title: "AI Analytics Suite",
    category: "Machine Learning",
    gradient: "from-purple-dark to-ceylon-blue-light",
  },
  {
    title: "Cloud Migration",
    category: "DevOps",
    gradient: "from-ceylon-blue-dark to-purple",
  },
];

/* ── single project card ── */
function ProjectCard({
  title,
  category,
  gradient,
  index,
}: {
  title: string;
  category: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="flex-shrink-0 w-72 sm:w-80"
    >
      <div className="glass-hover rounded-2xl overflow-hidden group" data-cursor="pointer">
        {/* cover image placeholder */}
        <div
          className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          {/* coming soon overlay */}
          <div className="absolute inset-0 bg-near-black/60 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-widest uppercase text-champagne/80">
              Coming Soon
            </span>
          </div>

          {/* project number */}
          <span className="absolute bottom-3 right-4 text-5xl font-bold text-white/10 font-heading">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* card body */}
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-purple-light mb-1">
            {category}
          </p>
          <h3 className="text-lg font-semibold text-text-primary font-heading">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

/* ── section header ── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="text-center mb-12">
      <span className="inline-block text-sm uppercase tracking-widest text-purple-light mb-3">
        Our Work
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading gradient-text-bright">
        Portfolio
      </h2>
    </motion.div>
  );
}

/* ── main component ── */
export default function PortfolioPlaceholder() {
  if (!SHOW_PORTFOLIO) return null;

  return (
    <section className="relative z-10 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        {/* horizontal scrolling row */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-light snap-x snap-mandatory">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
