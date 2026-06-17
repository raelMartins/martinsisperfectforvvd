export type PromptEntry = {
  id: string;
  title: string;
  phase: string;
  content: string;
  /** Placeholder for future screenshot assets */
  screenshotSrc?: string;
};

export const promptEntries: PromptEntry[] = [
  {
    id: "prompt-001",
    title: "Scaffold iMessage layout",
    phase: "Foundation",
    content: `Build a clean single-page Next.js app that looks exactly like an iOS/macOS iMessage window on desktop using Tailwind.

Requirements:
- Sidebar on the left (macOS message list style)
- Main chat window for the rest of the screen
- No global scroll — only the message container scrolls
- Strongly typed messagesData.ts with sender (me, Zied, Haseeb), text, video, image, and custom click targets
- Encode the full Product Engineer introduction dialogue`,
  },
  {
    id: "prompt-002",
    title: "Scroll reveals & typing indicator",
    phase: "Interaction",
    content: `Use Framer Motion to animate message bubbles. Reveal messages one-by-one as the user scrolls.

- Show iOS three-dot typing indicator for ~800ms before Zied/Haseeb messages
- Auto-scroll to bottom on each new bubble
- Dark mode default: bg #0B0B0C, my bubbles #0A84FF, theirs #262629
- Light mode toggle: bg #F2F2F7, my bubbles #007AFF, theirs #E5E5EA`,
  },
  {
    id: "prompt-003",
    title: "Media attachments & prompt gallery",
    phase: "Media & modals",
    content: `Style video containers like native iMessage attachments with rounded corners and play overlay. Click scales into a fullscreen Framer Motion modal (Loom embeds).

Harry Potter image bubble with native caption underneath (boxset + Hogwarts miniature).

"here" link opens a developer IDE-style prompt gallery modal with screenshot slots and PDF export of all prompts.`,
  },
];

export function getAllPromptsAsText() {
  return promptEntries
    .map(
      (entry, index) =>
        `--- Prompt ${index + 1}: ${entry.title} (${entry.phase}) ---\n\n${entry.content}`,
    )
    .join("\n\n\n");
}
