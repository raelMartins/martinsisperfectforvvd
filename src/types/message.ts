export type Sender = "me" | "zied" | "haseeb";

export const SENDER_LABELS: Record<Sender, string> = {
  me: "Martins",
  zied: "Zied",
  haseeb: "Haseeb",
};

export type VideoAttachment = {
  /** Direct video file for custom uploads */
  src?: string;
  /** Embed URL (e.g. Loom iframe) */
  embedUrl?: string;
  /** Original share link */
  shareUrl?: string;
  thumbnail?: string;
  provider?: "loom" | "custom";
  title?: string;
};

export type ImageItem = {
  src: string;
  alt: string;
};

export type ImageAttachment = {
  images: ImageItem[];
  caption?: string;
};

export type ClickTargetAction =
  | { type: "prompt-gallery-modal" }
  | { type: "external-link"; href: string };

export type ClickTarget = {
  label: string;
  action: ClickTargetAction;
};

/** Inline link within a text bubble — text before/after the clickable segment. */
export type TextWithClickTarget = {
  before: string;
  clickTarget: ClickTarget;
  after: string;
};

export type Message = {
  id: string;
  sender: Sender;
  text?: string;
  textWithClickTarget?: TextWithClickTarget;
  video?: VideoAttachment;
  image?: ImageAttachment;
};

export type Conversation = {
  id: string;
  title: string;
  participants: string[];
  lastPreview: string;
  lastTimestamp: string;
  unread?: boolean;
};

export type VideoModalPayload = {
  embedUrl: string;
  title?: string;
  shareUrl?: string;
  thumbnail?: string;
};
