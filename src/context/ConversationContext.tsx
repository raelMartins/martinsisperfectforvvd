"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getTypableText, isIncomingSender } from "@/lib/messageText";
import { useMotion } from "@/context/MotionContext";
import type { Message } from "@/types/message";

const TYPING_CHAR_MS = 30;
const INCOMING_TYPING_MS = 800;
const SEND_PAUSE_MS = 380;
const MEDIA_SEND_PAUSE_MS = 420;
const BOTTOM_THRESHOLD_PX = 120;

type ConversationContextValue = {
  messages: Message[];
  revealedCount: number;
  inputDraft: string;
  isComposing: boolean;
  showIncomingTyping: boolean;
};

const ConversationContext = createContext<ConversationContextValue | null>(null);

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type ConversationProviderProps = {
  messages: Message[];
  children: ReactNode;
};

export function ConversationProvider({
  messages,
  children,
}: ConversationProviderProps) {
  const { setScrollMetrics } = useMotion();

  const [revealedCount, setRevealedCount] = useState(0);
  const [inputDraft, setInputDraft] = useState("");
  const [showIncomingTyping, setShowIncomingTyping] = useState(false);

  const revealedCountRef = useRef(0);
  const isProcessingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const awaitingUserScrollRef = useRef(false);
  const userScrolledRef = useRef(false);
  const hasStartedRef = useRef(false);
  const typingAbortRef = useRef(0);

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

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
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
    },
    [updateScrollMotion],
  );

  const isNearBottom = useCallback(() => {
    const doc = document.documentElement;
    return (
      window.scrollY + window.innerHeight >=
      doc.scrollHeight - BOTTOM_THRESHOLD_PX
    );
  }, []);

  const typeInComposer = useCallback(async (text: string, session: number) => {
    setInputDraft("");

    for (let i = 1; i <= text.length; i += 1) {
      if (typingAbortRef.current !== session) return;
      setInputDraft(text.slice(0, i));
      await delay(TYPING_CHAR_MS);
    }
  }, []);

  const revealMessageAt = useCallback(
    (index: number) => {
      const nextCount = index + 1;
      revealedCountRef.current = nextCount;
      setRevealedCount(nextCount);
    },
    [],
  );

  const processNextMessage = useCallback(async () => {
    const index = revealedCountRef.current;
    if (isProcessingRef.current || index >= messages.length) return;

    isProcessingRef.current = true;
    const session = typingAbortRef.current + 1;
    typingAbortRef.current = session;

    const nextMessage = messages[index];

    try {
      if (nextMessage.sender === "me") {
        const typableText = getTypableText(nextMessage);

        if (typableText) {
          await typeInComposer(typableText, session);
          if (typingAbortRef.current !== session) return;

          await delay(SEND_PAUSE_MS);
          if (typingAbortRef.current !== session) return;

          setInputDraft("");
          revealMessageAt(index);
        } else {
          await delay(MEDIA_SEND_PAUSE_MS);
          if (typingAbortRef.current !== session) return;
          revealMessageAt(index);
        }
      } else if (isIncomingSender(nextMessage.sender)) {
        setShowIncomingTyping(true);
        requestAnimationFrame(() => scrollToBottom());
        await delay(INCOMING_TYPING_MS);
        if (typingAbortRef.current !== session) return;

        setShowIncomingTyping(false);
        revealMessageAt(index);
      } else {
        revealMessageAt(index);
      }

      awaitingUserScrollRef.current = true;
      userScrolledRef.current = false;
      requestAnimationFrame(() => scrollToBottom());
    } finally {
      isProcessingRef.current = false;
    }
  }, [messages, revealMessageAt, scrollToBottom, typeInComposer]);

  const tryAdvance = useCallback(() => {
    if (
      isProcessingRef.current ||
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
    void processNextMessage();
  }, [isNearBottom, messages.length, processNextMessage]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    awaitingUserScrollRef.current = false;
    void processNextMessage();
  }, [processNextMessage]);

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [revealedCount, showIncomingTyping, inputDraft, scrollToBottom]);

  useEffect(() => {
    updateScrollMotion();
  }, [revealedCount, showIncomingTyping, inputDraft, updateScrollMotion]);

  useEffect(() => {
    const onScroll = () => {
      updateScrollMotion();
      if (isAutoScrollingRef.current) return;
      tryAdvance();
    };

    const onWheel = () => {
      if (isAutoScrollingRef.current) return;
      userScrolledRef.current = true;
      tryAdvance();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      typingAbortRef.current += 1;
    };
  }, [tryAdvance, updateScrollMotion]);

  const value: ConversationContextValue = {
    messages,
    revealedCount,
    inputDraft,
    isComposing: inputDraft.length > 0,
    showIncomingTyping,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within ConversationProvider");
  }
  return context;
}
