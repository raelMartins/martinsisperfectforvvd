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
      className={`relative z-20 w-full shrink-0 border-b backdrop-blur-md ${glassClass} ${LAYOUT.headerHeightClass}`}
    >
      <div className="flex h-full flex-col px-4 pt-2 pb-2 sm:px-6 sm:pt-3 md:px-8 md:pt-4 md:pb-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <div className="flex items-center gap-1.5 pt-0.5 sm:gap-2">
            <button
              type="button"
              aria-label="Back"
              className="flex items-center text-[#0A84FF] transition-opacity hover:opacity-80"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
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
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0A84FF] px-1.5 text-xs font-semibold text-white sm:h-7 sm:min-w-7 sm:px-2 sm:text-sm lg:h-8 lg:min-w-8 lg:text-base">
                {unreadCount}
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium text-white/90 sm:h-14 sm:w-14 sm:text-lg md:h-16 md:w-16 md:text-xl lg:h-[72px] lg:w-[72px] lg:text-2xl"
              style={{ backgroundColor: colors.theirBubble }}
            >
              {initials}
            </div>
            <button
              type="button"
              className="mt-1 flex items-center gap-1 transition-opacity hover:opacity-80 sm:mt-1.5 lg:mt-2"
            >
              <span
                className="text-sm font-semibold tracking-tight sm:text-base md:text-lg lg:text-xl"
                style={{ color: colors.text }}
              >
                {conversation.title}
              </span>
              <svg
                className="h-3 w-3 sm:h-3.5 sm:w-3.5"
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

          <div className="flex items-start justify-end gap-1 pt-0.5 sm:gap-1.5">
            <ThemeToggle iconSize={20} className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
            <button
              type="button"
              aria-label="Video call"
              className="text-[#0A84FF] transition-opacity hover:opacity-80"
            >
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-[30px] lg:w-[30px]"
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
