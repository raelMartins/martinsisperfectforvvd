"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types/message";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import {
  loomEmbedSrc,
  loomIdFromShareUrl,
  loomThumbnailUrl,
  resolveLoomEmbedUrl,
} from "@/lib/loom";

type VideoAttachmentBubbleProps = {
  message: Message;
  layoutId?: string;
};

const ATTACHMENT_CLASS =
  "w-[min(100%,280px)] min-w-[200px] sm:w-full sm:max-w-[340px] md:max-w-[420px] lg:min-w-[300px] lg:max-w-[480px] xl:max-w-[520px]";

const LAYOUT_TRANSITION = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
};

function resolveThumbnail(message: Message): string | undefined {
  const video = message.video;
  if (!video) return undefined;
  if (video.thumbnail) return video.thumbnail;
  if (video.shareUrl && video.provider === "loom") {
    return loomThumbnailUrl(loomIdFromShareUrl(video.shareUrl));
  }
  const embedUrl = resolveLoomEmbedUrl(video);
  if (embedUrl) {
    const id = embedUrl.replace(/\/$/, "").split("/").pop();
    if (id) return loomThumbnailUrl(id);
  }
  return undefined;
}

function PopupOverlay({
  label,
  onOpen,
}: {
  label: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="absolute inset-0 z-10 cursor-pointer bg-transparent transition-colors hover:bg-black/10 active:bg-black/15"
    />
  );
}

function LoomInlineEmbed({
  embedUrl,
  title,
  layoutId,
  onOpen,
}: {
  embedUrl: string;
  title?: string;
  layoutId?: string;
  onOpen: () => void;
}) {
  const src = loomEmbedSrc(embedUrl);
  const label = title ? `Open video: ${title}` : "Open video";

  return (
    <motion.div
      layout="position"
      layoutId={layoutId}
      transition={LAYOUT_TRANSITION}
      className={`relative overflow-hidden rounded-[16px] bg-[#0B0B0C] sm:rounded-[20px] lg:rounded-[24px] ${ATTACHMENT_CLASS}`}
    >
      <div className="relative aspect-video w-full min-h-[120px] sm:min-h-0">
        <iframe
          src={src}
          title={title ?? "Loom video"}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          tabIndex={-1}
        />
        <PopupOverlay label={label} onOpen={onOpen} />
      </div>
    </motion.div>
  );
}

function ThumbnailFallback({
  message,
  layoutId,
  onOpen,
}: {
  message: Message;
  layoutId?: string;
  onOpen: () => void;
}) {
  const video = message.video!;
  const thumbnail = resolveThumbnail(message);
  const title = video.title;
  const label = title ? `Open video: ${title}` : "Open video";

  return (
    <motion.div
      layout="position"
      layoutId={layoutId}
      transition={LAYOUT_TRANSITION}
      className={`relative overflow-hidden rounded-[16px] bg-[#0B0B0C] sm:rounded-[20px] lg:rounded-[24px] ${ATTACHMENT_CLASS}`}
    >
      <div className="relative aspect-video w-full">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e]" />
        )}
        <PopupOverlay label={label} onOpen={onOpen} />
      </div>
    </motion.div>
  );
}

export default function VideoAttachmentBubble({
  message,
  layoutId,
}: VideoAttachmentBubbleProps) {
  const { openVideoMessage } = useVideoPlayback();
  const video = message.video;
  if (!video) return null;

  const handleOpen = () => openVideoMessage(message);
  const loomEmbedUrl = resolveLoomEmbedUrl(video);

  if (loomEmbedUrl) {
    return (
      <LoomInlineEmbed
        embedUrl={loomEmbedUrl}
        title={video.title}
        layoutId={layoutId}
        onOpen={handleOpen}
      />
    );
  }

  return (
    <ThumbnailFallback
      message={message}
      layoutId={layoutId}
      onOpen={handleOpen}
    />
  );
}
