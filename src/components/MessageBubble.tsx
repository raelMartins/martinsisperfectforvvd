"use client";

import type { Message } from "@/types/message";
import { SENDER_LABELS } from "@/types/message";

type MessageBubbleProps = {
  message: Message;
  showSenderName?: boolean;
};

function MessageText({ message }: { message: Message }) {
  if (message.textWithClickTarget) {
    const { before, clickTarget, after } = message.textWithClickTarget;

    return (
      <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.35]">
        {before}
        <button
          type="button"
          className="font-medium text-[#007AFF] underline decoration-[#007AFF]/40 underline-offset-2 hover:decoration-[#007AFF]"
          onClick={() => {
            // Modal gallery wired up in a follow-up pass
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
  if (message.video) {
    return (
      <div className="mt-1 overflow-hidden rounded-2xl">
        <div className="relative aspect-video w-full min-w-[220px] max-w-[320px] bg-black/5">
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
          <p className="mt-1.5 px-1 text-[12px] text-[#8e8e93]">
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
              className="relative aspect-[4/3] bg-[#e9e9eb]"
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
          <p className="px-1 text-[13px] leading-snug text-[#636366]">
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
  const isMe = message.sender === "me";
  const hasText = Boolean(message.text || message.textWithClickTarget);
  const hasMedia = Boolean(message.video || message.image);

  if (!hasText && !hasMedia) {
    return null;
  }

  return (
    <div
      className={[
        "flex w-full",
        isMe ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "flex max-w-[min(100%,72%)] flex-col",
          isMe ? "items-end" : "items-start",
        ].join(" ")}
      >
        {showSenderName && !isMe ? (
          <span className="mb-1 px-3 text-[12px] font-medium text-[#8e8e93]">
            {SENDER_LABELS[message.sender]}
          </span>
        ) : null}

        {hasText ? (
          <div
            className={[
              "rounded-[20px] px-3.5 py-2",
              isMe
                ? "rounded-br-md bg-[#007AFF] text-white"
                : "rounded-bl-md bg-[#e9e9eb] text-[#1d1d1f]",
              message.textWithClickTarget && isMe
                ? "[&_button]:text-white [&_button]:decoration-white/50"
                : "",
            ].join(" ")}
          >
            <MessageText message={message} />
          </div>
        ) : null}

        {hasMedia ? (
          <div className={hasText ? "mt-1" : ""}>
            <MessageMedia message={message} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
