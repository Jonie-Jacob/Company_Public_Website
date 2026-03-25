"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CONSENT_KEY = "zyphr-cookie-consent";

export default function ScrollToTop() {
  const scrollY = useScrollPosition();
  const prefersReducedMotion = useReducedMotion();
  const visible = scrollY > 400;

  // Track whether the cookie banner is likely visible
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setCookieBannerVisible(!stored);
  }, []);

  // Listen for consent being set (banner dismissed)
  useEffect(() => {
    const onUpdate = () => {
      setCookieBannerVisible(!localStorage.getItem(CONSENT_KEY));
    };
    window.addEventListener("storage", onUpdate);
    window.addEventListener("cookie-consent-update", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("cookie-consent-update", onUpdate);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  // Push button above cookie banner when it's visible
  const bottomOffset = cookieBannerVisible ? 200 : 32;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: "fixed", bottom: bottomOffset, right: 32, zIndex: 91 }}
          className="glass-btn w-12 h-12 rounded-full flex items-center justify-center focus-ring shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] transition-shadow"
          aria-label="Scroll to top"
          data-cursor="pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-light"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
