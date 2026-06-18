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

function MessageText({ message, isMe }: { message: Message; isMe: boolean }) {
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
      <p className="whitespace-pre-wrap break-words text-[26px] leading-[1.38] sm:text-[28px] lg:text-[30px]">
        {before}
        <button
          type="button"
          className="font-medium underline underline-offset-[3px]"
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
      <p className="whitespace-pre-wrap break-words text-[26px] leading-[1.38] sm:text-[28px] lg:text-[30px]">
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
          "flex max-w-[min(100%,68%)] flex-col",
          isMe ? "items-end" : "items-start",
        ].join(" ")}
      >
        {showSenderName && !isMe ? (
          <span
            className="mb-2 px-4 text-lg font-medium sm:text-xl"
            style={{ color: colors.muted }}
          >
            {SENDER_LABELS[message.sender]}
          </span>
        ) : null}

        {hasText ? (
          <div
            className={[
              "rounded-[28px] px-7 py-4 sm:px-8 sm:py-5",
              isMe ? "rounded-br-lg" : "rounded-bl-lg",
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
          <div className={hasText ? "mt-2" : ""}>
            <MessageMedia message={message} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
