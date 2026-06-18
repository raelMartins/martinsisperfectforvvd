import { resolveLoomEmbedUrl } from "@/lib/loom";
import type { Message, VideoModalPayload } from "@/types/message";

export function buildVideoModalPayload(
  message: Message,
): VideoModalPayload | null {
  if (!message.video) return null;

  const embedUrl =
    resolveLoomEmbedUrl(message.video) ??
    message.video.embedUrl ??
    message.video.src;

  if (!embedUrl) return null;

  return {
    embedUrl,
    title: message.video.title,
    shareUrl: message.video.shareUrl,
    thumbnail: message.video.thumbnail,
    messageId: message.id,
  };
}

export function isVideoMessage(message: Message): boolean {
  return Boolean(message.video && buildVideoModalPayload(message));
}
