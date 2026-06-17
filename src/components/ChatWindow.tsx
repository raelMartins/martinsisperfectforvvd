"use client";

import { useEffect, useRef } from "react";
import type { Conversation, Message } from "@/types/message";
import MessageBubble from "@/components/MessageBubble";

type ChatWindowProps = {
  conversation: Conversation;
  messages: Message[];
};

export default function ChatWindow({
  conversation,
  messages,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-white">
      <header className="flex h-[52px] shrink-0 items-center justify-center border-b border-black/10 bg-[#fbfbfb] px-4">
        <div className="text-center">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">
            {conversation.title}
          </h2>
          <p className="text-[11px] text-[#8e8e93]">iMessage</p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const showSenderName =
              message.sender !== "me" &&
              previous?.sender !== message.sender;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                showSenderName={showSenderName}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
