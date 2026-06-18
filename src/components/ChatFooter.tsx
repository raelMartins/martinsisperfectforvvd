"use client";

import { useMotionValueEvent, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useConversation } from "@/context/ConversationContext";
import { LAYOUT } from "@/constants/layout";
import PlayPauseButton from "@/components/PlayPauseButton";

function scrollDraftToEnd(viewport: HTMLDivElement | null) {
  if (!viewport) return;
  viewport.scrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
}

export default function ChatFooter() {
  const { colors, theme } = useTheme();
  const { composerDraft, isComposing } = useConversation();

  const draftRef = useRef<HTMLSpanElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textColorRef = useRef<HTMLDivElement>(null);

  const textColor = useTransform(isComposing, (length) =>
    length > 0 ? colors.text : colors.muted,
  );

  const syncDraft = useCallback((draft: string) => {
    const isEmpty = draft.length === 0;

    if (draftRef.current) draftRef.current.textContent = draft;
    if (placeholderRef.current) {
      placeholderRef.current.hidden = !isEmpty;
    }
    if (viewportRef.current) {
      viewportRef.current.hidden = isEmpty;
    }

    scrollDraftToEnd(viewportRef.current);
  }, []);

  useMotionValueEvent(composerDraft, "change", syncDraft);

  useMotionValueEvent(textColor, "change", (color) => {
    if (textColorRef.current) textColorRef.current.style.color = color;
  });

  useEffect(() => {
    syncDraft(composerDraft.get());
    if (textColorRef.current) {
      textColorRef.current.style.color =
        isComposing.get() > 0 ? colors.text : colors.muted;
    }
  }, [colors.muted, colors.text, composerDraft, isComposing, syncDraft]);

  const glassClass =
    theme === "dark"
      ? "border-white/[0.06] bg-black/60"
      : "border-black/[0.08] bg-white/70";

  return (
    <footer
      className={`relative z-20 w-full shrink-0 border-t backdrop-blur-md ${glassClass} ${LAYOUT.footerHeightClass}`}
    >
      <div className="flex h-full items-center gap-2.5 px-3 py-1.5 sm:gap-4 sm:px-5 md:gap-5 md:px-8 md:py-2">
        <PlayPauseButton />

        <div
          className="flex h-9 min-w-0 flex-1 items-center rounded-full px-3 sm:h-11 sm:px-5 md:h-12 md:px-6 lg:h-[64px] lg:px-7"
          style={{ backgroundColor: colors.theirBubble }}
        >
          <div
            ref={textColorRef}
            className="flex h-full min-w-0 flex-1 items-center text-sm font-normal sm:text-base lg:text-xl"
            style={{ color: colors.muted }}
            aria-live="polite"
            aria-label="Message input"
          >
            <span ref={placeholderRef} className="min-w-0 truncate">
              iMessage
            </span>
            <div
              ref={viewportRef}
              hidden
              className="h-full min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <span
                ref={draftRef}
                className="inline-flex h-full items-center whitespace-nowrap"
              />
            </div>
          </div>
          <button
            type="button"
            aria-label="Voice message"
            className="ml-2 shrink-0 transition-opacity hover:opacity-80 sm:ml-3"
            style={{ color: colors.muted }}
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
