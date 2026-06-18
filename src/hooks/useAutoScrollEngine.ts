"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AUTO_SCROLL } from "@/constants/autoScroll";

function getMaxScrollY() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type AutoScrollEngine = {
  isPlaying: boolean;
  isPlayingRef: RefObject<boolean>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
};

/**
 * RAF-driven window scroll loop. Pauses instantly on manual scroll input.
 * Works with Framer Motion useScroll — it reads the same window.scrollY.
 */
export function useAutoScrollEngine(): AutoScrollEngine {
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const isPlayingRef = useRef(isPlaying);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const isProgrammaticRef = useRef(false);
  const startedRef = useRef(false);

  const syncPlaying = useCallback((next: boolean) => {
    isPlayingRef.current = next;
    setIsPlaying(next);
    if (!next) lastFrameTimeRef.current = null;
  }, []);

  const pause = useCallback(() => {
    syncPlaying(false);
  }, [syncPlaying]);

  const play = useCallback(() => {
    if (getMaxScrollY() <= 0) return;
    lastFrameTimeRef.current = null;
    syncPlaying(true);
  }, [syncPlaying]);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) pause();
    else play();
  }, [pause, play]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let active = true;

    const tick = (timestamp: number) => {
      if (!active) return;

      if (isPlayingRef.current) {
        const last = lastFrameTimeRef.current;
        lastFrameTimeRef.current = timestamp;

        if (last !== null) {
          const deltaSeconds = Math.min((timestamp - last) / 1000, 0.1);
          const maxScrollY = getMaxScrollY();
          const nextY = Math.min(
            maxScrollY,
            window.scrollY + AUTO_SCROLL.pixelsPerSecond * deltaSeconds,
          );

          if (nextY > window.scrollY + 0.5) {
            isProgrammaticRef.current = true;
            window.scrollTo(0, nextY);
          } else if (window.scrollY >= maxScrollY - 1) {
            syncPlaying(false);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const delayId = window.setTimeout(startLoop, AUTO_SCROLL.startDelayMs);

    return () => {
      active = false;
      window.clearTimeout(delayId);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [syncPlaying]);

  useEffect(() => {
    const releaseProgrammatic = () => {
      isProgrammaticRef.current = false;
    };

    const onScroll = () => {
      if (!isProgrammaticRef.current) return;
      releaseProgrammatic();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const shouldIgnore = () => isProgrammaticRef.current;

    const onWheel = () => {
      if (shouldIgnore()) return;
      pause();
    };

    const onTouchMove = () => {
      if (shouldIgnore()) return;
      pause();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnore()) return;
      const scrollKeys = new Set([
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ]);
      if (scrollKeys.has(event.key)) pause();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pause]);

  return { isPlaying, isPlayingRef, play, pause, toggle };
}
