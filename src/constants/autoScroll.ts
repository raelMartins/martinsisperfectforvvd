/** Programmatic auto-scroll pacing for the scrollytelling timeline. */
export const AUTO_SCROLL = {
  /** Steady downward speed in CSS pixels per second (base 52 × 1.5). */
  pixelsPerSecond: 78,
  /** Brief pause after load before scrolling begins. */
  startDelayMs: 500,
} as const;
