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
  /** Framer layout id for scrollytelling push-up transitions. */
  layoutId?: string;
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
      <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.35] sm:text-[20px] md:text-[26px] lg:text-[30px] lg:leading-[1.38]">
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
      <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.35] sm:text-[20px] md:text-[26px] lg:text-[30px] lg:leading-[1.38]">
        {message.text}
      </p>
    );
  }

  return null;
}

function MessageMedia({
  message,
  layoutId,
}: {
  message: Message;
  layoutId?: string;
}) {
  if (message.video) {
    return (
      <VideoAttachmentBubble
        message={message}
        layoutId={layoutId ? `${layoutId}-video` : undefined}
      />
    );
  }

  if (message.image) {
    return <ImageAttachmentBubble image={message.image} />;
  }

  return null;
}

export default function MessageBubble({
  message,
  showSenderName = false,
  layoutId,
}: MessageBubbleProps) {
  const { colors } = useTheme();
  const isMe = message.sender === "me";
  const hasText = Boolean(message.text || message.textWithClickTarget);
  const hasMedia = Boolean(message.video || message.image);

  if (!hasText && !hasMedia) {
    return null;
  }

  const rowClassName = ["flex w-full", isMe ? "justify-end" : "justify-start"].join(
    " ",
  );

  const content = (
    <div
      className={[
        "flex max-w-[min(100%,82%)] flex-col sm:max-w-[min(100%,75%)] lg:max-w-[min(100%,68%)]",
        isMe ? "items-end" : "items-start",
      ].join(" ")}
    >
        {showSenderName && !isMe ? (
          <span
            className="mb-1 px-2 text-xs font-medium sm:mb-1.5 sm:px-3 sm:text-sm md:text-base lg:mb-2 lg:px-4 lg:text-xl"
            style={{ color: colors.muted }}
          >
            {SENDER_LABELS[message.sender]}
          </span>
        ) : null}

        {hasText ? (
          <div
            className={[
              "rounded-[18px] px-4 py-2.5 sm:rounded-[22px] sm:px-5 sm:py-3 md:rounded-[26px] md:px-6 md:py-3.5 lg:rounded-[28px] lg:px-8 lg:py-5",
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
          <div
            className={[
              hasText ? "mt-2" : "",
              "w-[min(100%,280px)] min-w-[200px] sm:w-full sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px]",
            ].join(" ")}
          >
            <MessageMedia message={message} layoutId={layoutId} />
          </div>
        ) : null}
      </div>
  );

  return (
    <motion.div
      layout="position"
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={rowClassName}
    >
      {content}
    </motion.div>
  );
}
