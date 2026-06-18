import type { Message } from "@/types/message";

/** Plain text to animate in the composer for outgoing messages. */
export function getTypableText(message: Message): string | null {
  if (message.text) return message.text;

  if (message.textWithClickTarget) {
    const { before, clickTarget, after } = message.textWithClickTarget;
    return `${before}${clickTarget.label}${after}`;
  }

  return null;
}

export function isIncomingSender(sender: Message["sender"]) {
  return sender === "zied" || sender === "haseeb";
}
