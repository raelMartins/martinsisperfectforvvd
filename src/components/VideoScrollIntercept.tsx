"use client";

import { useEffect, useRef } from "react";
import { useAutoScroll } from "@/context/AutoScrollContext";
import { useConversation } from "@/context/ConversationContext";
import { useModal } from "@/context/ModalContext";
import { buildVideoModalPayload } from "@/lib/videoModal";

/**
 * During auto-scroll playback, intercepts video messages: pauses scroll
 * and opens the Loom modal. Resume is handled on modal close.
 */
export default function VideoScrollIntercept() {
  const { messages, mountedIndices } = useConversation();
  const { isPlayingRef, pause } = useAutoScroll();
  const { openVideoModal, videoModal } = useModal();
  const interceptedIdsRef = useRef(new Set<string>());
  const prevMountedRef = useRef<number[]>([]);

  useEffect(() => {
    const prevMounted = new Set(prevMountedRef.current);
    prevMountedRef.current = mountedIndices;

    for (const index of mountedIndices) {
      if (prevMounted.has(index)) continue;

      const message = messages[index];
      if (!message) continue;

      const payload = buildVideoModalPayload(message);
      if (!payload) continue;
      if (interceptedIdsRef.current.has(message.id)) continue;
      if (!isPlayingRef.current) continue;
      if (videoModal) continue;

      interceptedIdsRef.current.add(message.id);
      pause();
      openVideoModal({ ...payload, resumeAutoScroll: true });
      break;
    }
  }, [
    mountedIndices,
    messages,
    isPlayingRef,
    pause,
    openVideoModal,
    videoModal,
  ]);

  return null;
}
