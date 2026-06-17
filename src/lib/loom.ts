const LOOM_SHARE_BASE = "https://www.loom.com/share";

export function loomShareUrl(id: string) {
  return `${LOOM_SHARE_BASE}/${id}`;
}

export function loomEmbedUrl(id: string) {
  return `https://www.loom.com/embed/${id}`;
}

export function loomThumbnailUrl(id: string) {
  return `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`;
}

export function loomIdFromShareUrl(shareUrl: string) {
  return shareUrl.replace(/\/$/, "").split("/").pop() ?? "";
}
