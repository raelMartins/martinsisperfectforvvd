"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo } from "react";
import {
  buildMessageTimelineSegments,
  computeScrollTimelineState,
} from "@/lib/scrollTimeline";
import type { Message } from "@/types/message";
import type {
  BuildTimelineOptions,
  MessageTimelineSegment,
  ScrollTimelineState,
} from "@/types/scrollTimeline";

const EMPTY_STATE: ScrollTimelineState = {
  globalProgress: 0,
  activeMessageIndex: null,
  messages: [],
  segments: [],
};

export type ScrollTimelineEngine = {
  scrollYProgress: MotionValue<number>;
  segments: readonly MessageTimelineSegment[];
  timelineState: MotionValue<ScrollTimelineState>;
  getTimelineStateAt: (globalProgress: number) => ScrollTimelineState;
};

/**
 * Pure window-scroll timeline engine.
 * scrollYProgress 0→1 is partitioned across the message array.
 */
export function useScrollTimeline(
  messages: readonly Message[],
  options?: BuildTimelineOptions,
): ScrollTimelineEngine {
  const { scrollYProgress } = useScroll();

  const segments = useMemo(
    () => buildMessageTimelineSegments(messages, options),
    [messages, options?.weightMode, options?.weights, options?.minSegmentSpan],
  );

  const getTimelineStateAt = useMemo(
    () => (p: number) => computeScrollTimelineState(segments, p),
    [segments],
  );

  const timelineState = useTransform(scrollYProgress, (progress) =>
    computeScrollTimelineState(segments, progress),
  );

  return {
    scrollYProgress,
    segments,
    timelineState,
    getTimelineStateAt,
  };
}

/** Debug helper — subscribe to timeline updates in React. */
export function useScrollTimelineDebug(
  timelineState: MotionValue<ScrollTimelineState>,
  onChange: (state: ScrollTimelineState) => void,
) {
  useMotionValueEvent(timelineState, "change", onChange);
}

export { EMPTY_STATE };
