"use client";

import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { LAYOUT } from "@/constants/layout";
import { useConversation } from "@/context/ConversationContext";
import { useTheme } from "@/context/ThemeContext";

export default function ChatThread() {
  const { colors } = useTheme();
  const { messages, revealedCount, showIncomingTyping } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const visibleMessages = messages.slice(0, revealedCount);

  return (
    <main
      className="relative z-10 w-full px-10 sm:px-16 lg:px-24"
      style={{
        backgroundColor: colors.chatBg,
        paddingTop: LAYOUT.headerHeight,
        paddingBottom: LAYOUT.footerHeight,
      }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-16 pt-10 text-center">
          <p className="text-2xl font-normal" style={{ color: colors.muted }}>
            iMessage
          </p>
          <p
            className="mt-1 text-2xl font-normal"
            style={{ color: colors.muted }}
          >
            Today
          </p>
        </div>

        <div className="flex flex-col gap-5 pb-16">
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => {
              const previous = visibleMessages[index - 1];
              const showSenderName =
                message.sender !== "me" && previous?.sender !== message.sender;
              const isLatest = index === visibleMessages.length - 1;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showSenderName={showSenderName}
                  emphasize={isLatest}
                />
              );
            })}
            {showIncomingTyping ? (
              <TypingIndicator key="typing-indicator" />
            ) : null}
          </AnimatePresence>

          <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </div>
      </div>
    </main>
  );
}
