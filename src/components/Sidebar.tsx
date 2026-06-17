"use client";

import type { Conversation } from "@/types/message";
import { useTheme } from "@/context/ThemeContext";

type SidebarProps = {
  conversations: Conversation[];
  activeId: string;
};

function Avatar({ label }: { label: string }) {
  const initials = label
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5AC8FA] to-[#007AFF] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

export default function Sidebar({ conversations, activeId }: SidebarProps) {
  const { colors } = useTheme();

  return (
    <aside
      className="flex h-full w-[min(100%,320px)] shrink-0 flex-col border-r"
      style={{
        backgroundColor: colors.sidebarBg,
        borderColor: colors.border,
      }}
    >
      <header
        className="flex h-[52px] shrink-0 items-center border-b px-4"
        style={{ borderColor: colors.border }}
      >
        <h1
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: colors.text }}
        >
          Messages
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul className="py-1">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeId;

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors"
                  style={{
                    backgroundColor: isActive ? colors.activeRow : "transparent",
                    color: isActive ? "#FFFFFF" : colors.text,
                  }}
                >
                  <Avatar label={conversation.title} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold">
                        {conversation.title}
                      </span>
                      <span
                        className="shrink-0 text-[12px]"
                        style={{
                          color: isActive ? "rgba(255,255,255,0.8)" : colors.muted,
                        }}
                      >
                        {conversation.lastTimestamp}
                      </span>
                    </div>
                    <p
                      className="truncate text-[13px]"
                      style={{
                        color: isActive ? "rgba(255,255,255,0.9)" : colors.muted,
                      }}
                    >
                      {conversation.lastPreview}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
