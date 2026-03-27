"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── aurora orb ── */
function AuroraOrb({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className ?? ""}`}
      style={style}
    />
  );
}

/* ── main component ── */
export default function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.35"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-28 md:py-36 overflow-hidden"
    >
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/80 via-purple/60 to-ceylon-blue/70" />

      {/* aurora blobs */}
      <AuroraOrb
        className="w-[500px] h-[500px] bg-purple-light animate-pulse"
        style={{ top: "-10%", left: "-8%", animationDuration: "6s" }}
      />
      <AuroraOrb
        className="w-[400px] h-[400px] bg-ceylon-blue-light animate-pulse"
        style={{ bottom: "-12%", right: "-6%", animationDuration: "8s" }}
      />
      <AuroraOrb
        className="w-[300px] h-[300px] bg-champagne animate-pulse"
        style={{ top: "30%", right: "20%", animationDuration: "10s", opacity: 0.08 }}
      />

      {/* subtle noise/grain overlay for texture */}
      <div className="absolute inset-0 bg-near-black/30" />

      {/* content */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
          <span className="gradient-text-bright">Have a Dream?</span>
          <br />
          <span className="text-text-primary">
            Let&apos;s Build It Together.
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          No idea is too small, no vision is too bold. Whether you&apos;re a
          startup with a spark or an enterprise ready to evolve — we&apos;re
          here to make it happen.
        </p>

        {/* glowing CTA button */}
        <Link href="/contact" data-cursor="pointer">
          <span className="group relative inline-flex items-center justify-center">
            {/* animated glow ring */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple to-ceylon-blue opacity-70 blur-lg group-hover:opacity-100 animate-pulse transition-opacity duration-500" />

            <span className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-purple to-ceylon-blue text-white font-semibold text-lg tracking-wide shadow-lg transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(123,47,190,0.5)] group-hover:scale-105">
              Contact Us
              {/* arrow icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
