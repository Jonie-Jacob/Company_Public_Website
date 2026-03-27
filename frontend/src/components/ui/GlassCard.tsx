"use client";

import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`${hover ? "glass-hover" : "glass"} p-6 ${className}`}
      data-cursor="pointer"
    >
      {children}
    </div>
  );
}
