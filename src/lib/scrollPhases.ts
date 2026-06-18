import { getTypableText, isIncomingSender } from "@/lib/messageText";
import { clamp01 } from "@/lib/scrollTimeline";
import type { Message } from "@/types/message";
import type {
  MessagePhase,
  MessagePhaseState,
  MessageScrollProgress,
  ScrollTimelineState,
} from "@/types/scrollTimeline";

/** Phase A ends here — remainder of the slice is Phase B (sent / bubble). */
export const OUTGOING_PHASE_A_END = 0.92;
export const INCOMING_PHASE_A_END = 0.86;
export const MEDIA_PHASE_A_END = 0;

export function isMediaOnlyMessage(message: Message): boolean {
  return Boolean(
    (message.video || message.image) && !getTypableText(message),
  );
}

export function getPhaseAEnd(message: Message): number {
  if (isMediaOnlyMessage(message)) return 0;
  if (message.sender === "me") {
    return getTypableText(message) ? OUTGOING_PHASE_A_END : MEDIA_PHASE_A_END;
  }
  if (isIncomingSender(message.sender)) return INCOMING_PHASE_A_END;
  return OUTGOING_PHASE_A_END;
}

export function getComposeCharIndex(
  localProgress: number,
  totalCharacters: number,
  phaseAEnd: number,
): number {
  if (totalCharacters <= 0 || localProgress <= 0) return 0;
  if (localProgress >= phaseAEnd) return totalCharacters;
  return Math.min(
    totalCharacters,
    Math.floor((localProgress / phaseAEnd) * totalCharacters),
  );
}

export function resolveMessagePhase(
  message: Message,
  progress: MessageScrollProgress | undefined,
): MessagePhaseState {
  const idle: MessagePhaseState = {
    phase: "idle",
    composeCharIndex: 0,
    mountBubble: false,
    showTyping: false,
  };

  if (!progress || progress.localProgress <= 0) return idle;

  if (isMediaOnlyMessage(message)) {
    return {
      phase: "phase-b",
      composeCharIndex: 0,
      mountBubble: true,
      showTyping: false,
    };
  }

  if (progress.status === "complete") {
    return {
      phase: "phase-b",
      composeCharIndex: 0,
      mountBubble: true,
      showTyping: false,
    };
  }

  const local = progress.localProgress;
  const phaseAEnd = getPhaseAEnd(message);
  const inPhaseA = local < phaseAEnd - 1e-6;

  if (message.sender === "me") {
    const text = getTypableText(message);
    if (inPhaseA) {
      return {
        phase: "phase-a",
        composeCharIndex: text
          ? getComposeCharIndex(local, text.length, phaseAEnd)
          : 0,
        mountBubble: false,
        showTyping: false,
      };
    }
    return {
      phase: "phase-b",
      composeCharIndex: 0,
      mountBubble: true,
      showTyping: false,
    };
  }

  if (isIncomingSender(message.sender)) {
    if (inPhaseA) {
      return {
        phase: "phase-a",
        composeCharIndex: 0,
        mountBubble: false,
        showTyping: true,
      };
    }
    return {
      phase: "phase-b",
      composeCharIndex: 0,
      mountBubble: true,
      showTyping: false,
    };
  }

  return {
    phase: inPhaseA ? "phase-a" : "phase-b",
    composeCharIndex: 0,
    mountBubble: !inPhaseA,
    showTyping: false,
  };
}

export function computeComposerDraft(
  messages: readonly Message[],
  state: ScrollTimelineState,
): string {
  const activeIndex = state.activeMessageIndex;
  if (activeIndex === null) return "";

  const message = messages[activeIndex];
  if (!message || message.sender !== "me") return "";

  const phase = resolveMessagePhase(message, state.messages[activeIndex]);
  if (phase.phase !== "phase-a") return "";

  const text = getTypableText(message);
  if (!text) return "";

  return text.slice(0, phase.composeCharIndex);
}

export function getMountedMessageIndices(
  messages: readonly Message[],
  state: ScrollTimelineState,
): number[] {
  const indices: number[] = [];
  state.messages.forEach((progress, index) => {
    const phase = resolveMessagePhase(messages[index], progress);
    if (phase.mountBubble) indices.push(index);
  });
  return indices;
}

export function getActiveTypingIndex(
  messages: readonly Message[],
  state: ScrollTimelineState,
): number | null {
  const activeIndex = state.activeMessageIndex;
  if (activeIndex === null) return null;
  const phase = resolveMessagePhase(
    messages[activeIndex],
    state.messages[activeIndex],
  );
  return phase.showTyping ? activeIndex : null;
}

export function getLocalPhaseProgress(
  localProgress: number,
  phaseAEnd: number,
  phase: MessagePhase,
): number {
  if (phase === "idle") return 0;
  if (phase === "phase-a") return clamp01(localProgress / phaseAEnd);
  if (phaseAEnd >= 1) return 1;
  return clamp01((localProgress - phaseAEnd) / (1 - phaseAEnd));
}
