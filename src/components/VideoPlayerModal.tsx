"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useAutoScroll } from "@/context/AutoScrollContext";
import { useModal } from "@/context/ModalContext";

export default function VideoPlayerModal() {
  const { videoModal, closeVideoModal } = useModal();
  const { play } = useAutoScroll();

  const handleClose = useCallback(() => {
    const shouldResume = videoModal?.resumeAutoScroll;
    closeVideoModal();
    if (shouldResume) {
      requestAnimationFrame(() => play());
    }
  }, [closeVideoModal, play, videoModal?.resumeAutoScroll]);

  useEffect(() => {
    if (!videoModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoModal, handleClose]);

  return (
    <AnimatePresence>
      {videoModal ? (
        <motion.div
          key="video-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] sm:bg-transparent sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close video"
            className="absolute inset-0 hidden bg-black/75 backdrop-blur-md sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={videoModal.title ?? "Video player"}
            className="relative z-10 flex max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem))] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-[#0B0B0C] shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:rounded-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0B0B0C] px-3 py-2.5 sm:px-4 sm:py-3">
              <p className="min-w-0 flex-1 truncate text-xs font-medium text-white/90 sm:text-sm">
                {videoModal.title ?? "Video"}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15"
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative min-h-0 w-full flex-1 bg-black">
              <div className="relative aspect-video w-full max-h-[min(56dvh,100%)] sm:max-h-none">
                <iframe
                  src={`${videoModal.embedUrl}?autoplay=1`}
                  title={videoModal.title ?? "Video"}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>
            </div>

            {videoModal.resumeAutoScroll ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="shrink-0 border-t border-white/10 bg-[#0B0B0C] px-3 py-2.5 text-center text-xs font-medium text-white/55 sm:px-4 sm:py-3 sm:text-sm"
              >
                Close video to resume chat
              </motion.p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
