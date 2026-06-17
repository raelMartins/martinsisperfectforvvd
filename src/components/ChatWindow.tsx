"use client";

import { AnimatePresence } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type UIEvent,
} from "react";
import type { Conversation, Message, Sender } from "@/types/message";
import MessageBubble from "@/components/MessageBubble";
import ThemeToggle from "@/components/ThemeToggle";
import TypingIndicator from "@/components/TypingIndicator";
import { useMotion } from "@/context/MotionContext";
import { useTheme } from "@/context/ThemeContext";

const TYPING_DURATION_MS = 800;
const BOTTOM_THRESHOLD_PX = 72;

type ChatWindowProps = {
  conversation: Conversation;
  messages: Message[];
};

function isIncomingSender(sender: Sender) {
  return sender === "zied" || sender === "haseeb";
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function ChatWindow({
  conversation,
  messages,
}: ChatWindowProps) {
  const { colors } = useTheme();
  const { setScrollMetrics } = useMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [revealedCount, setRevealedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const revealedCountRef = useRef(0);
  const isRevealingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const awaitingUserScrollRef = useRef(false);
  const userScrolledRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    revealedCountRef.current = revealedCount;
  }, [revealedCount]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollRef.current;
    if (!container) return;

    isAutoScrollingRef.current = true;
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    window.setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, behavior === "smooth" ? 450 : 50);
  }, []);

  const isNearBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return false;

    return (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - BOTTOM_THRESHOLD_PX
    );
  }, []);

  const revealNext = useCallback(async () => {
    const currentCount = revealedCountRef.current;
    if (isRevealingRef.current || currentCount >= messages.length) return;

    isRevealingRef.current = true;
    const nextMessage = messages[currentCount];

    if (isIncomingSender(nextMessage.sender)) {
      setIsTyping(true);
      requestAnimationFrame(() => scrollToBottom());
      await delay(TYPING_DURATION_MS);
      setIsTyping(false);
    }

    const nextCount = currentCount + 1;
    revealedCountRef.current = nextCount;
    setRevealedCount(nextCount);
    isRevealingRef.current = false;
    awaitingUserScrollRef.current = true;
    userScrolledRef.current = false;

    requestAnimationFrame(() => scrollToBottom());
  }, [messages, scrollToBottom]);

  const tryRevealNext = useCallback(() => {
    if (
      isRevealingRef.current ||
      isAutoScrollingRef.current ||
      revealedCountRef.current >= messages.length
    ) {
      return;
    }

    if (awaitingUserScrollRef.current && !userScrolledRef.current) {
      return;
    }

    if (!isNearBottom()) {
      return;
    }

    awaitingUserScrollRef.current = false;
    void revealNext();
  }, [isNearBottom, messages.length, revealNext]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    awaitingUserScrollRef.current = false;
    void revealNext();
  }, [revealNext]);

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [revealedCount, isTyping, scrollToBottom]);

  const updateScrollMotion = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setScrollMetrics(
      container.scrollTop,
      container.scrollHeight,
      container.clientHeight,
    );
  }, [setScrollMetrics]);

  useEffect(() => {
    updateScrollMotion();
  }, [revealedCount, isTyping, updateScrollMotion]);

  const handleUserScrollIntent = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    userScrolledRef.current = true;
    tryRevealNext();
  }, [tryRevealNext]);

  const handleScroll = useCallback(
    (_event: UIEvent<HTMLDivElement>) => {
      updateScrollMotion();
      if (isAutoScrollingRef.current) return;
      tryRevealNext();
    },
    [tryRevealNext, updateScrollMotion],
  );

  const visibleMessages = messages.slice(0, revealedCount);

  return (
    <section
      className="flex min-w-0 flex-1 flex-col"
      style={{ backgroundColor: colors.chatBg }}
    >
      <header
        className="relative flex h-[52px] shrink-0 items-center justify-center border-b px-4"
        style={{
          backgroundColor: colors.headerBg,
          borderColor: colors.border,
        }}
      >
        <div className="text-center">
          <h2
            className="text-[15px] font-semibold"
            style={{ color: colors.text }}
          >
            {conversation.title}
          </h2>
          <p className="text-[11px]" style={{ color: colors.muted }}>
            iMessage
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        onScroll={handleScroll}
        onWheel={handleUserScrollIntent}
        onTouchMove={handleUserScrollIntent}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => {
              const previous = visibleMessages[index - 1];
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
            {isTyping ? <TypingIndicator key="typing-indicator" /> : null}
          </AnimatePresence>

          <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}
