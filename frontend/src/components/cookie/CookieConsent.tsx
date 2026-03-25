"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { loadGA } from "@/lib/analytics";

const CONSENT_KEY = "zyphr-cookie-consent";

type ConsentState = "pending" | "accepted" | "declined";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so the banner doesn't fight with page load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    // If already accepted, load GA
    if (stored === "accepted") loadGA();
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted" satisfies ConsentState);
    setVisible(false);
    loadGA();
    window.dispatchEvent(new Event("cookie-consent-update"));
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "declined" satisfies ConsentState);
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-update"));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          style={{ position: "fixed", bottom: 24, left: 0, right: 0, zIndex: 90 }}
          className="pointer-events-none flex justify-center px-4 md:justify-end md:px-6"
        >
          <div
            className="pointer-events-auto w-full max-w-md glass rounded-2xl p-5
                       border border-white/10 shadow-lg shadow-purple/10"
            style={{ background: "rgba(15, 15, 26, 0.85)" }}
          >
          {/* ── Main banner ── */}
          {!showManage ? (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">
                We use cookies to enhance your experience and analyse traffic.
                By clicking &quot;Accept&quot; you consent to analytics cookies.{" "}
                <Link
                  href="/cookie-policy"
                  className="text-purple-light underline underline-offset-2 hover:text-champagne transition-colors"
                >
                  Learn more
                </Link>
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={accept}
                  className="glass-btn px-5 py-2 text-sm font-medium rounded-xl
                             bg-gradient-to-r from-purple to-ceylon-blue text-white
                             hover:shadow-lg hover:shadow-purple/25 transition-shadow"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowManage(true)}
                  className="px-4 py-2 text-sm font-medium rounded-xl
                             border border-white/15 text-text-secondary
                             hover:text-text-primary hover:border-white/25 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ) : (
            /* ── Manage view ── */
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Cookie Preferences
              </h3>

              {/* Essential — always on */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-text-primary font-medium">Essential</p>
                  <p className="text-text-muted text-xs">
                    Required for the site to function.
                  </p>
                </div>
                <span className="text-xs text-purple-light font-medium">
                  Always on
                </span>
              </div>

              {/* Analytics — toggle */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-text-primary font-medium">Analytics</p>
                  <p className="text-text-muted text-xs">
                    Helps us understand how visitors use the site.
                  </p>
                </div>
                {/* Simple accept / decline for now */}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={accept}
                  className="glass-btn px-5 py-2 text-sm font-medium rounded-xl
                             bg-gradient-to-r from-purple to-ceylon-blue text-white
                             hover:shadow-lg hover:shadow-purple/25 transition-shadow"
                >
                  Accept All
                </button>
                <button
                  onClick={decline}
                  className="px-4 py-2 text-sm font-medium rounded-xl
                             border border-white/15 text-text-secondary
                             hover:text-text-primary hover:border-white/25 transition-colors"
                >
                  Decline Analytics
                </button>
                <button
                  onClick={() => setShowManage(false)}
                  className="ml-auto text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
