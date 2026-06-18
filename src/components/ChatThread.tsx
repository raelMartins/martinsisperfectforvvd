"use client";

import { LayoutGroup } from "framer-motion";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { useConversation } from "@/context/ConversationContext";
import { useTheme } from "@/context/ThemeContext";

export default function ChatThread() {
  const { colors } = useTheme();
  const { messages, mountedIndices, typingIndex } = useConversation();

  return (
    <section
      className="relative z-10 flex min-h-0 flex-1 flex-col justify-end overflow-hidden"
      style={{ backgroundColor: colors.chatBg }}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-end px-10 sm:px-16 lg:px-24">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col justify-end">
          <div className="mb-8 shrink-0 pt-4 text-center">
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

          <LayoutGroup>
            <div className="flex flex-col justify-end gap-5 pb-4">
              {mountedIndices.map((index, position) => {
                const message = messages[index];
                const prevIndex =
                  position > 0 ? mountedIndices[position - 1] : undefined;
                const showSenderName =
                  message.sender !== "me" &&
                  (prevIndex === undefined ||
                    messages[prevIndex]?.sender !== message.sender);

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showSenderName={showSenderName}
                    layoutId={message.id}
                  />
                );
              })}

              {typingIndex !== null ? (
                <TypingIndicator key="incoming-typing" scrollDriven />
              ) : null}
            </div>
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
