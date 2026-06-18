"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo, useState } from "react";
import {
  buildMessageTimelineSegments,
  computeScrollTimelineState,
} from "@/lib/scrollTimeline";
import type { Message } from "@/types/message";
import type {
  MessageTimelineSegment,
  ScrollTimelineState,
  UseScrollLinkedConversationOptions,
} from "@/types/scrollTimeline";

const INITIAL_TIMELINE_STATE: ScrollTimelineState = {
  globalProgress: 0,
  activeMessageIndex: null,
  messages: [],
  segments: [],
};

export type ScrollLinkedConversationEngine = {
  /** Framer Motion global scroll progress ∈ [0, 1] (window). */
  scrollYProgress: MotionValue<number>;
  /** Precomputed contiguous timeline segments for the conversation. */
  segments: readonly MessageTimelineSegment[];
  /**
   * Derived timeline snapshot as a MotionValue — updates every scroll frame
   * without React re-renders. Pass to child motion components or subscribe
   * via useMotionValueEvent.
   */
  timelineState: MotionValue<ScrollTimelineState>;
  /** Synchronous pure function bound to current segments. */
  getTimelineStateAt: (globalProgress: number) => ScrollTimelineState;
  /**
   * Optional React state mirror when `subscribe: true` is passed.
   * Undefined when not subscribed.
   */
  timelineSnapshot?: ScrollTimelineState;
};

/**
 * Scroll-linked conversation engine.
 *
 * Maps window scroll progress [0, 1] across the message array, exposing
 * per-message local progress that is fully reversible when scrolling backward.
 * No timers, delays, or durations — motion freezes when scroll stops.
 */
export function useScrollLinkedConversation(
  messages: readonly Message[],
  options?: UseScrollLinkedConversationOptions,
): ScrollLinkedConversationEngine {
  const { scrollYProgress } = useScroll();

  const segments = useMemo(
    () =>
      buildMessageTimelineSegments(messages, {
        weightMode: options?.weightMode,
        weights: options?.weights,
        minSegmentSpan: options?.minSegmentSpan,
      }),
    [messages, options?.weightMode, options?.weights, options?.minSegmentSpan],
  );

  const getTimelineStateAt = useMemo(
    () => (globalProgress: number) =>
      computeScrollTimelineState(segments, globalProgress),
    [segments],
  );

  const timelineState = useTransform(scrollYProgress, (progress) =>
    computeScrollTimelineState(segments, progress),
  );

  const [timelineSnapshot, setTimelineSnapshot] = useState<ScrollTimelineState>(
    () =>
      segments.length > 0
        ? computeScrollTimelineState(segments, scrollYProgress.get())
        : INITIAL_TIMELINE_STATE,
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!options?.subscribe) return;
    setTimelineSnapshot(computeScrollTimelineState(segments, progress));
  });

  return {
    scrollYProgress,
    segments,
    timelineState,
    getTimelineStateAt,
    ...(options?.subscribe ? { timelineSnapshot } : {}),
  };
}

/**
 * Subscribe to timeline state updates in React.
 * Prefer MotionValues for scroll-driven UI; use this for debugging or legacy bridges.
 */
export function useTimelineSnapshot(
  timelineState: MotionValue<ScrollTimelineState>,
  initial: ScrollTimelineState = INITIAL_TIMELINE_STATE,
): ScrollTimelineState {
  const [snapshot, setSnapshot] = useState(initial);

  useMotionValueEvent(timelineState, "change", setSnapshot);

  return snapshot;
}
