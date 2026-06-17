"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types/message";
import { SENDER_LABELS } from "@/types/message";
import ImageAttachmentBubble from "@/components/ImageAttachmentBubble";
import VideoAttachmentBubble from "@/components/VideoAttachmentBubble";
import { useModal } from "@/context/ModalContext";
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
  const { openPromptGallery } = useModal();

  if (message.textWithClickTarget) {
    const { before, clickTarget, after } = message.textWithClickTarget;

    const handleClick = () => {
      if (clickTarget.action.type === "prompt-gallery-modal") {
        openPromptGallery();
      }
    };

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
          onClick={handleClick}
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
  if (message.video) {
    return <VideoAttachmentBubble video={message.video} />;
  }

  if (message.image) {
    return <ImageAttachmentBubble image={message.image} />;
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
