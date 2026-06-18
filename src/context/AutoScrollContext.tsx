"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useAutoScrollEngine,
  type AutoScrollEngine,
} from "@/hooks/useAutoScrollEngine";

const AutoScrollContext = createContext<AutoScrollEngine | null>(null);

type AutoScrollProviderProps = {
  children: ReactNode;
};

export function AutoScrollProvider({ children }: AutoScrollProviderProps) {
  const engine = useAutoScrollEngine();

  return (
    <AutoScrollContext.Provider value={engine}>
      {children}
    </AutoScrollContext.Provider>
  );
}

export function useAutoScroll() {
  const context = useContext(AutoScrollContext);
  if (!context) {
    throw new Error("useAutoScroll must be used within AutoScrollProvider");
  }
  return context;
}
