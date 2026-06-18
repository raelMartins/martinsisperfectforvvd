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
      className="relative z-10 flex min-h-0 flex-1 flex-col justify-end overflow-hidden bg-black"
      style={{ backgroundColor: colors.chatBg }}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-end px-4 sm:px-10 md:px-16 lg:px-24">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col justify-end">
          <div className="mb-4 shrink-0 pt-2 text-center sm:mb-6 sm:pt-3 lg:mb-8 lg:pt-4">
            <p
              className="text-sm font-normal sm:text-lg md:text-xl lg:text-2xl"
              style={{ color: colors.muted }}
            >
              iMessage
            </p>
            <p
              className="mt-0.5 text-sm font-normal sm:mt-1 sm:text-lg md:text-xl lg:text-2xl"
              style={{ color: colors.muted }}
            >
              Today
            </p>
          </div>

          <LayoutGroup>
            <div className="flex flex-col justify-end gap-3 pb-2 sm:gap-4 sm:pb-3 lg:gap-5 lg:pb-4">
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
