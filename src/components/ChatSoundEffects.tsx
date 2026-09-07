"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "framer-motion";
import { useConversation } from "@/context/ConversationContext";
import { useSound } from "@/context/SoundContext";

export default function ChatSoundEffects() {
  const { composerDraft, messages, mountedIndices } = useConversation();
  const { playSound } = useSound();
  const previousDraftLengthRef = useRef(composerDraft.get().length);
  const previousMountedRef = useRef<Set<number> | null>(null);

  useMotionValueEvent(composerDraft, "change", (draft) => {
    const previousLength = previousDraftLengthRef.current;
    previousDraftLengthRef.current = draft.length;

    if (draft.length > previousLength) {
      playSound("typing");
    }
  });

  useEffect(() => {
    const previousMounted = previousMountedRef.current;
    const currentMounted = new Set(mountedIndices);
    previousMountedRef.current = currentMounted;

    // Establish a baseline without making noise when loading a restored
    // scroll position.
    if (!previousMounted) return;

    const newlyMounted = mountedIndices.filter(
      (index) => !previousMounted.has(index),
    );
    const newestIndex = newlyMounted.at(-1);
    if (newestIndex === undefined) return;

    playSound(messages[newestIndex]?.sender === "me" ? "sent" : "received");
  }, [messages, mountedIndices, playSound]);

  return null;
}
