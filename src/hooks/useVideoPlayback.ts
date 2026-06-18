"use client";

import { useCallback } from "react";
import { useAutoScroll } from "@/context/AutoScrollContext";
import { useModal } from "@/context/ModalContext";
import { buildVideoModalPayload } from "@/lib/videoModal";
import type { Message, VideoModalPayload } from "@/types/message";

export function useVideoPlayback() {
  const { pause } = useAutoScroll();
  const { openVideoModal } = useModal();

  const openVideo = useCallback(
    (payload: VideoModalPayload) => {
      pause();
      openVideoModal({ ...payload, resumeAutoScroll: true });
    },
    [openVideoModal, pause],
  );

  const openVideoMessage = useCallback(
    (message: Message) => {
      const payload = buildVideoModalPayload(message);
      if (!payload) return false;
      openVideo(payload);
      return true;
    },
    [openVideo],
  );

  return { openVideo, openVideoMessage };
}
