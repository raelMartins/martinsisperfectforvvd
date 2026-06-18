import type { Message } from "@/types/message";

/** Lifecycle of a message within its dedicated scroll window. */
export type MessageScrollStatus = "pending" | "active" | "complete";

/**
 * One contiguous slice of the global [0, 1] scroll timeline.
 * Intervals use [globalStart, globalEnd) except the final segment, which
 * includes globalEnd === 1 so the bottom of the page fully completes it.
 */
export type MessageTimelineSegment = {
  messageIndex: number;
  messageId: string;
  globalStart: number;
  globalEnd: number;
  /** globalEnd - globalStart (always > 0) */
  span: number;
};

/** Per-message progress derived from global scroll position. */
export type MessageScrollProgress = {
  messageIndex: number;
  messageId: string;
  status: MessageScrollStatus;
  /** Clamped local progress within this message's window: 0 → 1 */
  localProgress: number;
  globalStart: number;
  globalEnd: number;
};

/** Full snapshot of scroll-linked conversation state at a single global progress value. */
export type ScrollTimelineState = {
  globalProgress: number;
  activeMessageIndex: number | null;
  messages: MessageScrollProgress[];
  segments: readonly MessageTimelineSegment[];
};

export type TimelineWeightMode = "equal" | "content";

export type BuildTimelineOptions = {
  /** How to allocate span across messages. Defaults to `"content"`. */
  weightMode?: TimelineWeightMode;
  /** Explicit weights per message; overrides weightMode when provided. */
  weights?: readonly number[];
  /**
   * Minimum span any message may occupy on the global timeline.
   * Prevents ultra-short segments for tiny messages. Default: 0.01
   */
  minSegmentSpan?: number;
};

export type UseScrollLinkedConversationOptions = BuildTimelineOptions & {
  /**
   * When true, subscribes to timeline updates and mirrors state into React.
   * Off by default — prefer MotionValues for scroll-linked UI.
   */
  subscribe?: boolean;
};
