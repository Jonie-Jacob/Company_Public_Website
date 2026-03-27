"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/constants";

/* ─── Initials avatar ─── */

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center
                 text-2xl font-bold text-white font-[family-name:var(--font-heading)]
                 gradient-brand shadow-lg shadow-purple/20"
    >
      {/* Glow ring */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-light to-ceylon-blue opacity-30 blur-md" />
      <span className="relative">{initials}</span>
    </div>
  );
}

/* ─── Single leadership card ─── */

function LeaderCard({
  name,
  role,
  quote,
  index,
}: {
  name: string;
  role: string;
  quote: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="group perspective">
      <div
        className="relative glass-hover p-6 text-center h-full
                   transition-all duration-500 [transform-style:preserve-3d]
                   group-hover:[transform:rotateY(180deg)]"
        style={{ minHeight: "280px" }}
      >
        {/* Front face */}
        <div className="[backface-visibility:hidden] flex flex-col items-center justify-center h-full gap-4">
          <Avatar name={name} />
          <div>
            <h3 className="text-lg font-semibold text-text-primary font-[family-name:var(--font-heading)]">
              {name}
            </h3>
            <p className="text-sm text-purple-light mt-1">{role}</p>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
                     flex flex-col items-center justify-center p-6 rounded-[20px]
                     bg-gradient-to-br from-purple/20 via-surface to-ceylon-blue/10
                     border border-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-8 h-8 text-purple-light/40 mb-3"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-champagne/90 text-sm italic leading-relaxed text-center">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="text-text-muted text-xs mt-4">— {name}</p>
        </div>
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
        Our Team
      </p>
      <h2 className="gradient-text-bright text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight">
        Meet Our Leadership
      </h2>
    </motion.div>
  );
}

/* ─── Leadership Team Section ─── */

export default function LeadershipTeam() {
  return (
    <section className="relative z-10 py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-ceylon-blue/[0.02] to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader />

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <LeaderCard
              key={member.id}
              name={member.name}
              role={member.role}
              quote={member.quote}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
