"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, Sender } from "@/types/message";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import { LAYOUT } from "@/constants/layout";
import { useMotion } from "@/context/MotionContext";
import { useTheme } from "@/context/ThemeContext";

const TYPING_DURATION_MS = 800;
const BOTTOM_THRESHOLD_PX = 120;

type ChatThreadProps = {
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

export default function ChatThread({ messages }: ChatThreadProps) {
  const { colors } = useTheme();
  const { setScrollMetrics } = useMotion();
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

  const updateScrollMotion = useCallback(() => {
    const doc = document.documentElement;
    setScrollMetrics(
      window.scrollY,
      doc.scrollHeight,
      window.innerHeight,
    );
  }, [setScrollMetrics]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    isAutoScrollingRef.current = true;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    });

    window.setTimeout(
      () => {
        isAutoScrollingRef.current = false;
        updateScrollMotion();
      },
      behavior === "smooth" ? 500 : 50,
    );
  }, [updateScrollMotion]);

  const isNearBottom = useCallback(() => {
    const doc = document.documentElement;
    return (
      window.scrollY + window.innerHeight >=
      doc.scrollHeight - BOTTOM_THRESHOLD_PX
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

  useEffect(() => {
    updateScrollMotion();
  }, [revealedCount, isTyping, updateScrollMotion]);

  useEffect(() => {
    const onScroll = () => {
      updateScrollMotion();
      if (isAutoScrollingRef.current) return;
      tryRevealNext();
    };

    const onWheel = () => {
      if (isAutoScrollingRef.current) return;
      userScrolledRef.current = true;
      tryRevealNext();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, [tryRevealNext, updateScrollMotion]);

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
          <p
            className="text-2xl font-normal"
            style={{ color: colors.muted }}
          >
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
    </main>
  );
}
