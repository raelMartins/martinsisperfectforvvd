"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";
import {
  computeComposerDraft,
  getActiveTypingIndex,
  getMountedMessageIndices,
} from "@/lib/scrollPhases";
import { useMotion } from "@/context/MotionContext";
import type { Message } from "@/types/message";
import type { ScrollTimelineState } from "@/types/scrollTimeline";
import type { ScrollTimelineEngine } from "@/hooks/useScrollTimeline";

type ConversationContextValue = ScrollTimelineEngine & {
  messages: readonly Message[];
  composerDraft: MotionValue<string>;
  isComposing: MotionValue<number>;
  /** Indices of bubbles currently mounted in the thread (Phase B+). */
  mountedIndices: number[];
  /** Active incoming typing indicator index, or null. */
  typingIndex: number | null;
};

const ConversationContext = createContext<ConversationContextValue | null>(
  null,
);

function indicesSignature(indices: number[]) {
  return indices.join(",");
}

type ConversationProviderProps = {
  messages: readonly Message[];
  children: ReactNode;
};

export function ConversationProvider({
  messages,
  children,
}: ConversationProviderProps) {
  const engine = useScrollTimeline(messages);
  const { setScrollMetrics } = useMotion();

  const composerDraft = useTransform(engine.timelineState, (state) =>
    computeComposerDraft(messages, state),
  );
  const isComposing = useTransform(composerDraft, (draft) => draft.length);

  const [mountedIndices, setMountedIndices] = useState<number[]>([]);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);

  const mountedSigRef = useRef("");
  const typingRef = useRef<number | null>(null);

  const syncFromTimeline = useMemo(
    () => (state: ScrollTimelineState) => {
      const nextMounted = getMountedMessageIndices(messages, state);
      const nextSig = indicesSignature(nextMounted);
      if (nextSig !== mountedSigRef.current) {
        mountedSigRef.current = nextSig;
        setMountedIndices(nextMounted);
      }

      const nextTyping = getActiveTypingIndex(messages, state);
      if (nextTyping !== typingRef.current) {
        typingRef.current = nextTyping;
        setTypingIndex(nextTyping);
      }
    },
    [messages],
  );

  useMotionValueEvent(engine.timelineState, "change", syncFromTimeline);

  useMotionValueEvent(engine.scrollYProgress, "change", () => {
    const doc = document.documentElement;
    setScrollMetrics(
      window.scrollY,
      doc.scrollHeight,
      window.innerHeight,
    );
  });

  useEffect(() => {
    syncFromTimeline(engine.getTimelineStateAt(engine.scrollYProgress.get()));
    const doc = document.documentElement;
    setScrollMetrics(
      window.scrollY,
      doc.scrollHeight,
      window.innerHeight,
    );
  }, [engine, messages.length, setScrollMetrics, syncFromTimeline]);

  const value: ConversationContextValue = {
    ...engine,
    messages,
    composerDraft,
    isComposing,
    mountedIndices,
    typingIndex,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within ConversationProvider");
  }
  return context;
}
