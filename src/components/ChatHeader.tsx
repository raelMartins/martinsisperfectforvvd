"use client";

import type { Conversation } from "@/types/message";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { LAYOUT } from "@/constants/layout";

type ChatHeaderProps = {
  conversation: Conversation;
  unreadCount?: number;
};

function getAvatarInitials(title: string) {
  return title
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ChatHeader({
  conversation,
  unreadCount = 33,
}: ChatHeaderProps) {
  const { colors, theme } = useTheme();
  const initials = getAvatarInitials(conversation.title);
  const glassClass =
    theme === "dark"
      ? "border-white/[0.06] bg-black/60"
      : "border-black/[0.08] bg-white/70";

  return (
    <header
      className={`relative z-20 w-full shrink-0 border-b backdrop-blur-md ${glassClass}`}
      style={{ height: LAYOUT.headerHeight }}
    >
      <div className="flex h-full flex-col px-8 pt-4 pb-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              aria-label="Back"
              className="flex items-center text-[#0A84FF] transition-opacity hover:opacity-80"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#0A84FF] px-2 text-base font-semibold text-white">
                {unreadCount}
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-2xl font-medium text-white/90"
              style={{ backgroundColor: colors.theirBubble }}
            >
              {initials}
            </div>
            <button
              type="button"
              className="mt-2 flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              <span
                className="text-xl font-semibold tracking-tight"
                style={{ color: colors.text }}
              >
                {conversation.title}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.muted}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="flex items-start justify-end gap-1.5 pt-0.5">
            <ThemeToggle iconSize={22} />
            <button
              type="button"
              aria-label="Video call"
              className="text-[#0A84FF] transition-opacity hover:opacity-80"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                <rect x="2" y="6" width="14" height="12" rx="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
