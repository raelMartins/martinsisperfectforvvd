"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAutoScroll } from "@/context/AutoScrollContext";
import { useModal } from "@/context/ModalContext";
import { useTheme } from "@/context/ThemeContext";
import { getSchedulingEmbedSrc, getSchedulingUrl } from "@/lib/scheduling";

const DESKTOP_QUERY = "(min-width: 640px)";

function subscribeDesktopLayout(onStoreChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getDesktopLayout() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

export default function SchedulingModal() {
  const { isSchedulingOpen, closeScheduling } = useModal();
  const { colors, theme } = useTheme();
  const { isPlayingRef, pause, play } = useAutoScroll();
  const isDesktop = useSyncExternalStore(
    subscribeDesktopLayout,
    getDesktopLayout,
    () => false,
  );
  const [loadedEmbedSrc, setLoadedEmbedSrc] = useState<string | null>(null);
  const shouldResumeRef = useRef(false);

  const layout = isDesktop ? "month_view" : "column_view";
  const embedSrc = getSchedulingEmbedSrc(layout, theme);
  const bookingUrl = getSchedulingUrl();
  const isEmbedLoaded = Boolean(embedSrc) && loadedEmbedSrc === embedSrc;

  const handleClose = useCallback(() => {
    closeScheduling();
    if (shouldResumeRef.current) {
      requestAnimationFrame(() => play());
    }
  }, [closeScheduling, play]);

  useEffect(() => {
    if (!isSchedulingOpen) return;

    shouldResumeRef.current = isPlayingRef.current;
    pause();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, isPlayingRef, isSchedulingOpen, pause]);

  return (
    <AnimatePresence>
      {isSchedulingOpen ? (
        <motion.div
          key="scheduling-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] sm:bg-transparent sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close scheduler"
            className="absolute inset-0 hidden bg-black/75 backdrop-blur-md sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book a meeting"
            className="relative z-10 flex h-[min(92dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem))] w-full max-w-[420px] flex-col overflow-hidden rounded-xl shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:h-[min(78dvh,680px)] sm:max-w-[min(1100px,92vw)] sm:w-[92vw] sm:rounded-2xl"
            style={{ backgroundColor: colors.windowBg }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4 sm:py-3"
              style={{ borderBottomColor: colors.border }}
            >
              <p
                className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm"
                style={{ color: colors.text }}
              >
                Book a quick chat
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ color: colors.muted }}
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

            <div className="relative min-h-0 w-full flex-1">
              {embedSrc ? (
                <>
                  {isEmbedLoaded ? null : (
                    <div
                      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm"
                      style={{ color: colors.muted }}
                    >
                      Loading calendar…
                    </div>
                  )}
                  <iframe
                    key={embedSrc}
                    src={embedSrc}
                    title="Book a meeting with Martins"
                    className="absolute inset-0 h-full w-full border-0"
                    allow="payment; camera; microphone; fullscreen"
                    onLoad={() => setLoadedEmbedSrc(embedSrc)}
                  />
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm" style={{ color: colors.text }}>
                    Scheduling is unavailable right now.
                  </p>
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium underline underline-offset-2"
                      style={{ color: colors.accent }}
                    >
                      Open booking page
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
