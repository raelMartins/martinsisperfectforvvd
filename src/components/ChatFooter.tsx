"use client";

import { useTheme } from "@/context/ThemeContext";
import { useConversation } from "@/context/ConversationContext";
import { LAYOUT } from "@/constants/layout";

export default function ChatFooter() {
  const { colors, theme } = useTheme();
  const { inputDraft, isComposing } = useConversation();

  const glassClass =
    theme === "dark"
      ? "border-white/[0.06] bg-black/60"
      : "border-black/[0.08] bg-white/70";

  return (
    <footer
      className={`fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 border-t backdrop-blur-md ${glassClass}`}
      style={{
        maxWidth: LAYOUT.columnMaxWidth,
        height: LAYOUT.footerHeight,
      }}
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
          className="flex h-[64px] flex-1 items-center overflow-hidden rounded-full px-7"
          style={{ backgroundColor: colors.theirBubble }}
        >
          <div
            className="flex min-w-0 flex-1 items-center text-xl font-normal"
            style={{ color: isComposing ? colors.text : colors.muted }}
            aria-live="polite"
            aria-label={isComposing ? "Composing message" : "Message input"}
          >
            {isComposing ? (
              <span className="truncate whitespace-pre-wrap">
                {inputDraft}
                <span className="ml-px inline-block w-[2px] animate-pulse bg-current opacity-70">
                  &nbsp;
                </span>
              </span>
            ) : (
              <span>iMessage</span>
            )}
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
