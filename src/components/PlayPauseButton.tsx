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
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full transition-opacity hover:opacity-80"
        style={{ backgroundColor: colors.theirBubble }}
      >
        {isPlaying ? (
          <Pause
            size={26}
            strokeWidth={2.25}
            style={{ color: colors.muted }}
            aria-hidden
          />
        ) : (
          <Play
            size={26}
            strokeWidth={2.25}
            className="ml-0.5"
            style={{ color: colors.muted }}
            aria-hidden
          />
        )}
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
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
