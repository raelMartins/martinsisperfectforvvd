import { getTypableText, isIncomingSender } from "@/lib/messageText";
import type { Message } from "@/types/message";
import type {
  BuildTimelineOptions,
  MessageScrollProgress,
  MessageScrollStatus,
  MessageTimelineSegment,
  ScrollTimelineState,
  TimelineWeightMode,
} from "@/types/scrollTimeline";

const DEFAULT_MIN_SEGMENT_SPAN = 0.01;
const EPSILON = 1e-9;

/** Clamp a number to the inclusive range [0, 1]. */
export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/** Normalize scroll metrics into global progress ∈ [0, 1]. */
export function computeGlobalScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= EPSILON) return 0;
  return clamp01(scrollTop / maxScroll);
}

/**
 * Heuristic weight for allocating scroll runway per message.
 * Longer / richer messages receive a larger segment of the timeline.
 */
export function getMessageScrollWeight(message: Message): number {
  let weight = 1;

  const text = getTypableText(message);
  if (text) {
    weight += text.length * 0.004;
  }

  if (message.video) weight += 2.5;
  if (message.image) weight += 2;

  if (isIncomingSender(message.sender)) {
    weight += 1.25;
  }

  return Math.max(weight, 0.25);
}

function resolveWeights(
  messages: readonly Message[],
  options?: BuildTimelineOptions,
): number[] {
  if (options?.weights) {
    if (options.weights.length !== messages.length) {
      throw new Error(
        `scrollTimeline: expected ${messages.length} weights, received ${options.weights.length}`,
      );
    }

    return options.weights.map((weight) => {
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error("scrollTimeline: weights must be finite numbers > 0");
      }
      return weight;
    });
  }

  const mode: TimelineWeightMode = options?.weightMode ?? "content";

  if (mode === "equal") {
    return messages.map(() => 1);
  }

  return messages.map(getMessageScrollWeight);
}

function enforceMinimumSpan(
  weights: number[],
  minSegmentSpan: number,
): number[] {
  const count = weights.length;
  if (count === 0) return weights;

  const minTotal = minSegmentSpan * count;
  if (minTotal >= 1) {
    return weights.map(() => 1 / count);
  }

  const scale = 1 - minTotal;
  const weightSum = weights.reduce((sum, w) => sum + w, 0) || count;

  return weights.map((weight) => minSegmentSpan + (weight / weightSum) * scale);
}

/**
 * Partition the global [0, 1] timeline across messages.
 * Segments are contiguous, non-overlapping, and sum to exactly 1.
 */
export function buildMessageTimelineSegments(
  messages: readonly Message[],
  options?: BuildTimelineOptions,
): MessageTimelineSegment[] {
  if (messages.length === 0) return [];

  const minSegmentSpan = options?.minSegmentSpan ?? DEFAULT_MIN_SEGMENT_SPAN;
  const normalizedWeights = enforceMinimumSpan(
    resolveWeights(messages, options),
    minSegmentSpan,
  );

  const weightTotal = normalizedWeights.reduce((sum, w) => sum + w, 0);

  let cursor = 0;
  const segments: MessageTimelineSegment[] = [];

  for (let index = 0; index < messages.length; index += 1) {
    const isLast = index === messages.length - 1;
    const message = messages[index];
    const span = isLast ? 1 - cursor : normalizedWeights[index] / weightTotal;

    const globalStart = cursor;
    const globalEnd = isLast ? 1 : cursor + span;

    segments.push({
      messageIndex: index,
      messageId: message.id,
      globalStart,
      globalEnd,
      span: globalEnd - globalStart,
    });

    cursor = globalEnd;
  }

  return segments;
}

function getMessageStatus(
  globalProgress: number,
  segment: MessageTimelineSegment,
  isLastSegment: boolean,
): MessageScrollStatus {
  if (globalProgress < segment.globalStart - EPSILON) {
    return "pending";
  }

  const reachedEnd = isLastSegment
    ? globalProgress >= segment.globalEnd - EPSILON
    : globalProgress >= segment.globalEnd - EPSILON;

  if (reachedEnd) {
    return "complete";
  }

  return "active";
}

/**
 * Local progress for a single message segment.
 * Fully reversible: decreasing globalProgress decreases localProgress linearly.
 */
export function getMessageLocalProgress(
  globalProgress: number,
  segment: MessageTimelineSegment,
): number {
  if (globalProgress <= segment.globalStart + EPSILON) return 0;
  if (globalProgress >= segment.globalEnd - EPSILON) return 1;

  const local = (globalProgress - segment.globalStart) / segment.span;
  return clamp01(local);
}

/** Index of the message whose scroll window currently contains globalProgress. */
export function getActiveMessageIndex(
  segments: readonly MessageTimelineSegment[],
  globalProgress: number,
): number | null {
  if (segments.length === 0) return null;

  const p = clamp01(globalProgress);

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;
    const inRange = isLast
      ? p >= segment.globalStart - EPSILON && p <= segment.globalEnd + EPSILON
      : p >= segment.globalStart - EPSILON && p < segment.globalEnd - EPSILON;

    if (inRange) return segment.messageIndex;
  }

  if (p >= 1 - EPSILON) return segments[segments.length - 1]?.messageIndex ?? null;
  return null;
}

/** Derive full per-message progress snapshot from global scroll progress. */
export function computeScrollTimelineState(
  segments: readonly MessageTimelineSegment[],
  globalProgress: number,
): ScrollTimelineState {
  const p = clamp01(globalProgress);
  const activeMessageIndex = getActiveMessageIndex(segments, p);

  const messages: MessageScrollProgress[] = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;

    return {
      messageIndex: segment.messageIndex,
      messageId: segment.messageId,
      status: getMessageStatus(p, segment, isLast),
      localProgress: getMessageLocalProgress(p, segment),
      globalStart: segment.globalStart,
      globalEnd: segment.globalEnd,
    };
  });

  return {
    globalProgress: p,
    activeMessageIndex,
    messages,
    segments,
  };
}

/** Convenience: number of messages that have any non-zero local progress. */
export function countStartedMessages(state: ScrollTimelineState): number {
  return state.messages.filter((m) => m.localProgress > 0).length;
}

/** Convenience: number of fully completed messages. */
export function countCompletedMessages(state: ScrollTimelineState): number {
  return state.messages.filter((m) => m.status === "complete").length;
}

/**
 * Inverse lookup: find the global progress at the start of a message window.
 * Useful for programmatic scroll-to-message.
 */
export function getGlobalProgressForMessageStart(
  segments: readonly MessageTimelineSegment[],
  messageIndex: number,
): number | null {
  const segment = segments.find((s) => s.messageIndex === messageIndex);
  return segment?.globalStart ?? null;
}
