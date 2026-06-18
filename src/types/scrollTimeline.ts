import type { Message } from "@/types/message";

export type MessageScrollStatus = "pending" | "active" | "complete";

export type MessageTimelineSegment = {
  messageIndex: number;
  messageId: string;
  globalStart: number;
  globalEnd: number;
  span: number;
};

export type MessageScrollProgress = {
  messageIndex: number;
  messageId: string;
  status: MessageScrollStatus;
  /** Local progress within this message's window ∈ [0, 1]. */
  localProgress: number;
  globalStart: number;
  globalEnd: number;
};

export type ScrollTimelineState = {
  globalProgress: number;
  activeMessageIndex: number | null;
  messages: MessageScrollProgress[];
  segments: readonly MessageTimelineSegment[];
};

export type TimelineWeightMode = "equal" | "content";

export type BuildTimelineOptions = {
  weightMode?: TimelineWeightMode;
  weights?: readonly number[];
  minSegmentSpan?: number;
};

export type MessagePhase = "idle" | "phase-a" | "phase-b";

export type MessagePhaseState = {
  phase: MessagePhase;
  /** Character index for outgoing compose (phase A only). */
  composeCharIndex: number;
  /** Whether the bubble should be mounted in the thread. */
  mountBubble: boolean;
  /** Incoming typing indicator visible (phase A only). */
  showTyping: boolean;
};
