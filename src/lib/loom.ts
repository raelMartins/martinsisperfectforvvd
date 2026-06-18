const LOOM_SHARE_BASE = "https://www.loom.com/share";
const LOOM_EMBED_BASE = "https://www.loom.com/embed";

export function loomShareUrl(id: string) {
  return `${LOOM_SHARE_BASE}/${id}`;
}

export function loomEmbedUrl(id: string) {
  return `${LOOM_EMBED_BASE}/${id}`;
}

export function loomThumbnailUrl(id: string) {
  return `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`;
}

export function loomIdFromShareUrl(shareUrl: string) {
  return shareUrl.replace(/\/$/, "").split("/").pop() ?? "";
}

type LoomVideoFields = {
  embedUrl?: string;
  shareUrl?: string;
  provider?: "loom" | "custom";
};

/** Resolve a Loom iframe src from embed or share URLs in messagesData. */
export function resolveLoomEmbedUrl(video: LoomVideoFields): string | null {
  if (video.embedUrl?.includes("loom.com/embed")) {
    return video.embedUrl;
  }

  if (video.provider === "loom" && video.shareUrl) {
    return loomEmbedUrl(loomIdFromShareUrl(video.shareUrl));
  }

  if (video.shareUrl?.includes("loom.com/embed")) {
    return video.shareUrl;
  }

  if (video.embedUrl) {
    return video.embedUrl;
  }

  return null;
}

/** Loom embed with minimal chrome for inline iMessage attachments. */
export function loomEmbedSrc(embedUrl: string) {
  const url = new URL(embedUrl);
  url.searchParams.set("hide_owner", "true");
  url.searchParams.set("hide_share", "true");
  url.searchParams.set("hide_title", "true");
  url.searchParams.set("hideEmbedTopBar", "true");
  return url.toString();
}
