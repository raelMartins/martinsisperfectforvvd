"use client";

import { useEffect, useRef } from "react";
import { useAutoScroll } from "@/context/AutoScrollContext";
import { useConversation } from "@/context/ConversationContext";
import { useModal } from "@/context/ModalContext";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { buildVideoModalPayload } from "@/lib/videoModal";

const SCROLL_DIRECTION_THRESHOLD = 0.5;

/**
 * On downward scroll (auto or manual), intercepts newly mounted video messages:
 * pauses playback and opens the Loom modal. Resume is handled on modal close.
 */
export default function VideoScrollIntercept() {
  const { messages, mountedIndices } = useConversation();
  const { isPlayingRef } = useAutoScroll();
  const { openVideo } = useVideoPlayback();
  const { videoModal } = useModal();
  const interceptedIdsRef = useRef(new Set<string>());
  const prevMountedRef = useRef<number[]>([]);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<"down" | "up" | "idle">("idle");

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastScrollYRef.current;
      if (Math.abs(delta) >= SCROLL_DIRECTION_THRESHOLD) {
        scrollDirectionRef.current = delta > 0 ? "down" : "up";
      }
      lastScrollYRef.current = nextY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mountedSet = new Set(mountedIndices);
    for (const id of interceptedIdsRef.current) {
      const index = messages.findIndex((message) => message.id === id);
      if (index >= 0 && !mountedSet.has(index)) {
        interceptedIdsRef.current.delete(id);
      }
    }
  }, [mountedIndices, messages]);

  useEffect(() => {
    const prevMounted = new Set(prevMountedRef.current);
    prevMountedRef.current = mountedIndices;

    const scrollingDown =
      scrollDirectionRef.current === "down" || isPlayingRef.current;
    if (!scrollingDown) return;
    if (videoModal) return;

    for (const index of mountedIndices) {
      if (prevMounted.has(index)) continue;

      const message = messages[index];
      if (!message) continue;

      const payload = buildVideoModalPayload(message);
      if (!payload) continue;
      if (interceptedIdsRef.current.has(message.id)) continue;

      interceptedIdsRef.current.add(message.id);
      openVideo(payload);
      break;
    }
  }, [mountedIndices, messages, openVideo, videoModal]);

  return null;
}
