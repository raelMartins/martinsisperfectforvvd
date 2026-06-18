"use client";

import { useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useConversation } from "@/context/ConversationContext";
import { LAYOUT } from "@/constants/layout";

export default function ChatFooter() {
  const { colors, theme } = useTheme();
  const { composerDraft, isComposing } = useConversation();

  const draftRef = useRef<HTMLSpanElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const textColor = useTransform(isComposing, (length) =>
    length > 0 ? colors.text : colors.muted,
  );

  useMotionValueEvent(composerDraft, "change", (draft) => {
    if (draftRef.current) draftRef.current.textContent = draft;
    if (placeholderRef.current) placeholderRef.current.hidden = draft.length > 0;
    if (draftRef.current) draftRef.current.hidden = draft.length === 0;
  });

  useMotionValueEvent(textColor, "change", (color) => {
    if (textContainerRef.current) textContainerRef.current.style.color = color;
  });

  useEffect(() => {
    const draft = composerDraft.get();
    if (draftRef.current) draftRef.current.textContent = draft;
    if (placeholderRef.current) placeholderRef.current.hidden = draft.length > 0;
    if (draftRef.current) draftRef.current.hidden = draft.length === 0;
    if (textContainerRef.current) {
      textContainerRef.current.style.color =
        isComposing.get() > 0 ? colors.text : colors.muted;
    }
  }, [colors.muted, colors.text, composerDraft, isComposing]);

  const glassClass =
    theme === "dark"
      ? "border-white/[0.06] bg-black/60"
      : "border-black/[0.08] bg-white/70";

  return (
    <footer
      className={`relative z-20 w-full shrink-0 border-t backdrop-blur-md ${glassClass}`}
      style={{ height: LAYOUT.footerHeight }}
    >
      <div className="flex h-full items-center gap-5 px-8 py-2">
        <button
          type="button"
          aria-label="Add attachment"
          className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ backgroundColor: colors.theirBubble }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.muted}
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <div
          className="flex h-[64px] flex-1 items-center rounded-full px-7"
          style={{ backgroundColor: colors.theirBubble }}
        >
          <div
            ref={textContainerRef}
            className="flex min-w-0 flex-1 items-center text-xl font-normal"
            style={{ color: colors.muted }}
            aria-live="polite"
            aria-label="Message input"
          >
            <span ref={placeholderRef}>iMessage</span>
            <span
              ref={draftRef}
              className="truncate whitespace-pre-wrap"
              hidden
            />
          </div>
          <button
            type="button"
            aria-label="Voice message"
            className="ml-3 shrink-0 transition-opacity hover:opacity-80"
            style={{ color: colors.muted }}
          >
            <svg
              width="28"
              height="28"
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
