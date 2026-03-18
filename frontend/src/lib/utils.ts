import { clsx, type ClassValue } from "clsx";

/**
 * Utility to conditionally join classNames.
 * Lightweight alternative to clsx + twMerge for now.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
