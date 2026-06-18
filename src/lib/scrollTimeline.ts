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

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function getMessageScrollWeight(message: Message): number {
  let weight = 1;
  const text = getTypableText(message);
  if (text) weight += text.length * 0.004;
  if (message.video) weight += 2.5;
  if (message.image) weight += 2;
  if (isIncomingSender(message.sender)) weight += 1.25;
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
    return options.weights.map((w) => {
      if (!Number.isFinite(w) || w <= 0) throw new Error("invalid weight");
      return w;
    });
  }
  const mode: TimelineWeightMode = options?.weightMode ?? "content";
  return mode === "equal"
    ? messages.map(() => 1)
    : messages.map(getMessageScrollWeight);
}

function enforceMinimumSpan(weights: number[], minSegmentSpan: number): number[] {
  const count = weights.length;
  if (count === 0) return weights;
  const minTotal = minSegmentSpan * count;
  if (minTotal >= 1) return weights.map(() => 1 / count);
  const scale = 1 - minTotal;
  const sum = weights.reduce((a, b) => a + b, 0) || count;
  return weights.map((w) => minSegmentSpan + (w / sum) * scale);
}

export function buildMessageTimelineSegments(
  messages: readonly Message[],
  options?: BuildTimelineOptions,
): MessageTimelineSegment[] {
  if (messages.length === 0) return [];

  const minSegmentSpan = options?.minSegmentSpan ?? DEFAULT_MIN_SEGMENT_SPAN;
  const normalized = enforceMinimumSpan(
    resolveWeights(messages, options),
    minSegmentSpan,
  );
  const total = normalized.reduce((a, b) => a + b, 0);

  let cursor = 0;
  const segments: MessageTimelineSegment[] = [];

  for (let i = 0; i < messages.length; i += 1) {
    const isLast = i === messages.length - 1;
    const span = isLast ? 1 - cursor : normalized[i] / total;
    const globalStart = cursor;
    const globalEnd = isLast ? 1 : cursor + span;
    segments.push({
      messageIndex: i,
      messageId: messages[i].id,
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
  isLast: boolean,
): MessageScrollStatus {
  if (globalProgress < segment.globalStart - EPSILON) return "pending";
  const pastEnd = isLast
    ? globalProgress >= segment.globalEnd - EPSILON
    : globalProgress >= segment.globalEnd - EPSILON;
  if (pastEnd) return "complete";
  return "active";
}

export function getMessageLocalProgress(
  globalProgress: number,
  segment: MessageTimelineSegment,
): number {
  if (globalProgress <= segment.globalStart + EPSILON) return 0;
  if (globalProgress >= segment.globalEnd - EPSILON) return 1;
  return clamp01((globalProgress - segment.globalStart) / segment.span);
}

export function getActiveMessageIndex(
  segments: readonly MessageTimelineSegment[],
  globalProgress: number,
): number | null {
  if (segments.length === 0) return null;
  const p = clamp01(globalProgress);

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;
    const inside = isLast
      ? p >= segment.globalStart - EPSILON && p <= segment.globalEnd + EPSILON
      : p >= segment.globalStart - EPSILON && p < segment.globalEnd - EPSILON;
    if (inside) return segment.messageIndex;
  }

  if (p >= 1 - EPSILON) return segments[segments.length - 1]?.messageIndex ?? null;
  return null;
}

export function computeScrollTimelineState(
  segments: readonly MessageTimelineSegment[],
  globalProgress: number,
): ScrollTimelineState {
  const p = clamp01(globalProgress);
  const messages: MessageScrollProgress[] = segments.map((segment, index) => ({
    messageIndex: segment.messageIndex,
    messageId: segment.messageId,
    status: getMessageStatus(p, segment, index === segments.length - 1),
    localProgress: getMessageLocalProgress(p, segment),
    globalStart: segment.globalStart,
    globalEnd: segment.globalEnd,
  }));

  return {
    globalProgress: p,
    activeMessageIndex: getActiveMessageIndex(segments, p),
    messages,
    segments,
  };
}
