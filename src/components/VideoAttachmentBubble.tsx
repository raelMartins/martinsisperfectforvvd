"use client";

import { motion } from "framer-motion";
import type { VideoAttachment } from "@/types/message";
import { useModal } from "@/context/ModalContext";
import { loomEmbedUrl, loomIdFromShareUrl, loomThumbnailUrl } from "@/lib/loom";

type VideoAttachmentBubbleProps = {
  video: VideoAttachment;
};

function PlayButton() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-[0_6px_32px_rgba(0,0,0,0.4)] sm:h-24 sm:w-24">
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="#1d1d1f"
        className="ml-1"
        aria-hidden
      >
        <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
      </svg>
    </div>
  );
}

function resolveVideoPayload(video: VideoAttachment) {
  if (video.embedUrl) {
    return {
      embedUrl: video.embedUrl,
      shareUrl: video.shareUrl,
      thumbnail: video.thumbnail,
      title: video.title,
    };
  }

  if (video.shareUrl && video.provider === "loom") {
    const id = loomIdFromShareUrl(video.shareUrl);
    return {
      embedUrl: loomEmbedUrl(id),
      shareUrl: video.shareUrl,
      thumbnail: video.thumbnail ?? loomThumbnailUrl(id),
      title: video.title,
    };
  }

  if (video.src) {
    return {
      embedUrl: video.src,
      shareUrl: video.shareUrl,
      thumbnail: video.thumbnail,
      title: video.title,
    };
  }

  return null;
}

export default function VideoAttachmentBubble({
  video,
}: VideoAttachmentBubbleProps) {
  const { openVideoModal } = useModal();
  const payload = resolveVideoPayload(video);

  if (!payload) return null;

  const thumbnail =
    payload.thumbnail ??
    (video.shareUrl && video.provider === "loom"
      ? loomThumbnailUrl(loomIdFromShareUrl(video.shareUrl))
      : undefined);

  return (
    <button
      type="button"
      onClick={() => openVideoModal(payload)}
      className="group relative block w-full min-w-[300px] max-w-[480px] overflow-hidden rounded-[24px] text-left sm:min-w-[360px] sm:max-w-[520px]"
      aria-label={video.title ? `Play video: ${video.title}` : "Play video"}
    >
      <div className="relative aspect-[4/3] w-full bg-[#1c1c1e]">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e]" />
        )}

        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            <PlayButton />
          </motion.div>
        </div>
      </div>
    </button>
  );
}
