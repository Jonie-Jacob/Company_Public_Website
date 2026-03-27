"use client";

import { useSyncExternalStore } from "react";

/**
 * Detects low-end devices based on hardware capabilities.
 * - CPU cores ≤ 2
 * - Device memory ≤ 4 GB
 * Result is cached after first evaluation and never changes per session.
 */

let cachedResult: boolean | null = null;

function detect(): boolean {
  if (cachedResult !== null) return cachedResult;

  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    hardwareConcurrency?: number;
    deviceMemory?: number;
  };

  const lowCores =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2;
  const lowMemory =
    typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;

  // If either signal indicates low-end, flag it.
  // If neither API is available, assume capable device.
  cachedResult = lowCores || lowMemory;
  return cachedResult;
}

// Value never changes within a session, so subscribe is a no-op.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return detect();
}

function getServerSnapshot() {
  return false;
}

export function useLowEndDevice() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
