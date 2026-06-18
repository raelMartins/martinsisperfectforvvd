"use client";

import { Pause, Play } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAutoScroll } from "@/context/AutoScrollContext";

export default function PlayPauseButton() {
  const { colors } = useTheme();
  const { isPlaying, toggle } = useAutoScroll();

  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
        aria-pressed={isPlaying}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-[60px] lg:w-[60px]"
        style={{ backgroundColor: colors.theirBubble }}
      >
        {isPlaying ? (
          <Pause
            className="h-5 w-5 sm:h-[22px] sm:w-[22px] lg:h-[26px] lg:w-[26px]"
            strokeWidth={2.25}
            style={{ color: colors.muted }}
            aria-hidden
          />
        ) : (
          <Play
            className="ml-0.5 h-5 w-5 sm:h-[22px] sm:w-[22px] lg:h-[26px] lg:w-[26px]"
            strokeWidth={2.25}
            style={{ color: colors.muted }}
            aria-hidden
          />
        )}
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:block sm:text-sm"
        style={{
          backgroundColor: colors.theirBubble,
          color: colors.text,
        }}
      >
        Play/Pause Chat
      </span>
    </div>
  );
}
