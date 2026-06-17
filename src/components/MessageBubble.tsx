"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types/message";
import { SENDER_LABELS } from "@/types/message";
import { useTheme } from "@/context/ThemeContext";

type MessageBubbleProps = {
  message: Message;
  showSenderName?: boolean;
};

function MessageText({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) {
  const { colors } = useTheme();

  if (message.textWithClickTarget) {
    const { before, clickTarget, after } = message.textWithClickTarget;

    return (
      <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.35]">
        {before}
        <button
          type="button"
          className="font-medium underline underline-offset-2"
          style={{
            color: isMe ? colors.meText : colors.link,
            textDecorationColor: isMe
              ? "rgba(255,255,255,0.5)"
              : `${colors.link}66`,
          }}
          onClick={() => {
            console.log("click target:", clickTarget.action);
          }}
        >
          {clickTarget.label}
        </button>
        {after}
      </p>
    );
  }

  if (message.text) {
    return (
      <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.35]">
        {message.text}
      </p>
    );
  }

  return null;
}

function MessageMedia({ message }: { message: Message }) {
  const { colors } = useTheme();

  if (message.video) {
    return (
      <div className="mt-1 overflow-hidden rounded-2xl">
        <div className="relative aspect-video w-full min-w-[220px] max-w-[320px] bg-black/20">
          <video
            className="h-full w-full object-cover"
            src={message.video.src}
            poster={message.video.thumbnail}
            controls
            preload="metadata"
          >
            <track kind="captions" />
          </video>
        </div>
        {message.video.title ? (
          <p
            className="mt-1.5 px-1 text-[12px]"
            style={{ color: colors.muted }}
          >
            {message.video.title}
          </p>
        ) : null}
      </div>
    );
  }

  if (message.image) {
    return (
      <div className="mt-1 space-y-2">
        <div
          className={[
            "grid gap-1 overflow-hidden rounded-2xl",
            message.image.images.length > 1 ? "grid-cols-2" : "grid-cols-1",
          ].join(" ")}
        >
          {message.image.images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3]"
              style={{ backgroundColor: colors.theirBubble }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {message.image.caption ? (
          <p
            className="px-1 text-[13px] leading-snug"
            style={{ color: colors.muted }}
          >
            {message.image.caption}
          </p>
        ) : null}
      </div>
    );
  }

  return null;
}

export default function MessageBubble({
  message,
  showSenderName = false,
}: MessageBubbleProps) {
  const { colors } = useTheme();
  const isMe = message.sender === "me";
  const hasText = Boolean(message.text || message.textWithClickTarget);
  const hasMedia = Boolean(message.video || message.image);

  if (!hasText && !hasMedia) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 28,
        mass: 0.8,
      }}
      className={["flex w-full", isMe ? "justify-end" : "justify-start"].join(
        " ",
      )}
    >
      <div
        className={[
          "flex max-w-[min(100%,72%)] flex-col",
          isMe ? "items-end" : "items-start",
        ].join(" ")}
      >
        {showSenderName && !isMe ? (
          <span
            className="mb-1 px-3 text-[12px] font-medium"
            style={{ color: colors.muted }}
          >
            {SENDER_LABELS[message.sender]}
          </span>
        ) : null}

        {hasText ? (
          <div
            className={[
              "rounded-[20px] px-3.5 py-2",
              isMe ? "rounded-br-md" : "rounded-bl-md",
            ].join(" ")}
            style={{
              backgroundColor: isMe ? colors.meBubble : colors.theirBubble,
              color: isMe ? colors.meText : colors.theirText,
            }}
          >
            <MessageText message={message} isMe={isMe} />
          </div>
        ) : null}

        {hasMedia ? (
          <div className={hasText ? "mt-1" : ""}>
            <MessageMedia message={message} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
