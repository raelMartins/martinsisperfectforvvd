"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type MotionSnapshot = {
  mouse: { x: number; y: number };
  scrollProgress: number;
  reducedMotion: boolean;
};

type MotionContextValue = {
  motionRef: MutableRefObject<MotionSnapshot>;
  setScrollMetrics: (
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
  ) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const motionRef = useRef<MotionSnapshot>({
    mouse: { x: 0, y: 0 },
    scrollProgress: 0,
    reducedMotion: false,
  });

  const setScrollMetrics = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      const maxScroll = scrollHeight - clientHeight;
      motionRef.current.scrollProgress =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    },
    [],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionRef.current.reducedMotion = media.matches;

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      motionRef.current.reducedMotion = event.matches;
    };

    const onPointerMove = (event: PointerEvent) => {
      motionRef.current.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      motionRef.current.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    media.addEventListener("change", onMotionPreferenceChange);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      media.removeEventListener("change", onMotionPreferenceChange);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const value: MotionContextValue = {
    motionRef,
    setScrollMetrics,
  };

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
