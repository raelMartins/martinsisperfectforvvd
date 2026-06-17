"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useModal } from "@/context/ModalContext";

export default function VideoPlayerModal() {
  const { videoModal, closeVideoModal } = useModal();

  useEffect(() => {
    if (!videoModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideoModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoModal, closeVideoModal]);

  return (
    <AnimatePresence>
      {videoModal ? (
        <motion.div
          key="video-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            aria-label="Close video"
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={videoModal.title ?? "Video player"}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[#1c1c1e] px-4 py-3">
              <p className="truncate text-sm font-medium text-white/90">
                {videoModal.title ?? "Video"}
              </p>
              <button
                type="button"
                onClick={closeVideoModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg
                  width="16"
                  height="16"
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

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${videoModal.embedUrl}?autoplay=1`}
                title={videoModal.title ?? "Video"}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
