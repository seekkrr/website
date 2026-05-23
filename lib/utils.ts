import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip HTML/script tags to prevent XSS.
 * Removes < and > characters from strings.
 */
export function stripTags(v: string): string {
  return v.replace(/[<>]/g, "");
}
