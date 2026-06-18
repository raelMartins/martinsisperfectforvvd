import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const prompts = JSON.parse(
  fs.readFileSync(path.join(root, "tmp-prompts.json"), "utf8"),
);

const meta = [
  {
    title: "Scaffold iMessage layout",
    phase: "Foundation",
    blueprint: `Goals:
- Single-page Next.js app mimicking iOS/macOS iMessage on desktop
- Tailwind styling with sidebar + main chat window
- No global scroll — only the message container scrolls
- Strongly typed messagesData.ts (senders: me, Zied, Haseeb)
- Support text, video, image, and custom click targets
- Encode the full Product Engineer introduction dialogue for VVD`,
  },
  {
    title: "Scroll reveals & typing indicator",
    phase: "Interaction",
    blueprint: `Goals:
- Framer Motion bubble reveal on scroll (one-by-one, not all at once)
- iOS three-dot typing indicator ~800ms before Zied/Haseeb messages
- Auto-scroll to bottom as new bubbles appear
- Dark mode default (#0B0B0C, blue me bubbles, grey theirs)
- Light mode toggle in the UI`,
  },
  {
    title: "Media attachments & Loom videos",
    phase: "Media & modals",
    blueprint: `Goals:
- iMessage-style video attachment bubbles with rounded corners + play overlay
- Fullscreen Framer Motion modal for Loom embeds
- Harry Potter image attachments with native captions
- "here" click target opens IDE-style Prompt History modal
- PDF / txt export of prompt history`,
  },
  {
    title: "React Three Fiber background",
    phase: "Visual polish",
    blueprint: `Goals:
- Subtle R3F canvas behind the entire chat app
- Floating particles or slow morphing mesh
- Mouse + scroll reactive motion at 60fps
- Theme-aware colors/opacity for dark and light mode`,
  },
  {
    title: "Cinematic iMessage layout rebuild",
    phase: "Layout rebuild",
    blueprint: `Goals:
- Rebuild shell to match mobile iMessage screenshot at cinematic desktop scale
- max-w-[1800px] centered column, sticky header/footer, flex chat body
- Scale up typography and bubbles for large displays
- Remove macOS sidebar — pure single-column iMessage`,
  },
  {
    title: "Header & footer scale-down",
    phase: "Layout tuning",
    blueprint: `Goals:
- Scale header/footer to ~60% of current size
- Reduce header avatar, title font, and padding
- Tighten footer vertical padding; input pill only slightly smaller
- Rename contact header to "VVD"`,
  },
  {
    title: "Conversation state machine",
    phase: "Scroll orchestration",
    blueprint: `Goals:
- Scroll position triggers next message block
- Outgoing messages type character-by-character in fixed bottom input bar
- On complete string, clear input and mount bubble in thread
- Incoming messages show typing indicator first, then bubble`,
  },
  {
    title: "Scroll-linked pacing math",
    phase: "Scroll physics",
    blueprint: `Goals:
- Zero time-based animations — scroll is the only clock
- useScroll global progress 0→1 mapped across message array
- Per-message local progress for phase A (typing) and phase B (sent)
- Perfect reverse on scroll up`,
  },
  {
    title: "Wire scroll math to UI",
    phase: "Scroll wiring",
    blueprint: `Goals:
- Map local progress to Math.floor(progress * charCount) for composer draft
- Mount bubbles at phase B boundary with Framer layout push-up
- Incoming typing indicator driven by scroll segment phase A`,
  },
  {
    title: "Sticky pinning architecture",
    phase: "Scroll layout",
    blueprint: `Goals:
- h-[600–800vh] scrub track for browser scrollbar
- sticky top-0 h-screen camera locks UI in viewport
- Internal thread scroll for message history (later superseded)`,
  },
  {
    title: "Remove auto-scroll to bottom",
    phase: "Cleanup",
    blueprint: `Goals:
- Remove automatic scroll-to-bottom on new messages
- User controls vertical scroll manually`,
  },
  {
    title: "Pure scrollytelling refactor",
    phase: "Scrollytelling",
    blueprint: `Goals:
- Golden rule: no internal scrollbars anywhere
- Window scroll scrubs timeline like a video playhead
- h-[1000vh] track + sticky camera + useScroll timeline engine
- Phase A typing / Phase B bubble mount per message slice
- flex-col justify-end thread with layout push-up`,
  },
  {
    title: "Pin iMessage header in thread",
    phase: "Layout polish",
    blueprint: `Goals:
- "iMessage" and "Today" labels always visible at top of chat body
- Chat column full height from first load
- New messages stack upward from the bottom`,
  },
  {
    title: "Double scrub track height",
    phase: "Pacing",
    blueprint: `Goals:
- Increase scrub track from 1000vh → 2000vh
- Finer character-by-character typing control via longer physical scroll`,
  },
  {
    title: "Loom inline embed attachments",
    phase: "Media",
    blueprint: `Goals:
- Render Loom iframe inside iMessage video attachment bubble
- rounded-[24px] corners + Framer layout animations
- Mount video bubble instantly when preceding text completes`,
  },
  {
    title: "Auto-scroll on page load",
    phase: "Auto-play",
    blueprint: `Goals:
- RAF programmatic scroll on load at readable pace
- Pause on wheel / touch / arrow keys
- Play/Pause button in footer with tooltip
- Compatible with Framer useScroll timeline`,
  },
  {
    title: "Video intercept & modal flow",
    phase: "Media playback",
    blueprint: `Goals:
- Auto-pause scroll when video message is reached
- Auto-open Loom fullscreen modal
- "Close video to resume chat" hint
- Resume auto-scroll on modal close`,
  },
  {
    title: "Pacing & timeline tightening",
    phase: "Scroll physics",
    blueprint: `Goals:
- 1.5× auto-scroll pixel speed
- Tighter segment weights — minimal gap between messages
- Media messages mount almost instantly after prior text`,
  },
  {
    title: "Video modal auto-close on end",
    phase: "Modal polish",
    blueprint: `Goals:
- Detect Loom video completion in modal
- Auto-close modal and resume auto-scroll when video ends`,
  },
  {
    title: "Video opens fullscreen on click",
    phase: "Video UX",
    blueprint: `Goals:
- Clicking inline video opens fullscreen popup (not inline playback)
- Closing popup resumes auto-scroll`,
  },
  {
    title: "Video popup on manual scroll down",
    phase: "Video UX",
    blueprint: `Goals:
- Trigger video modal on downward scroll (manual or auto)
- Do not trigger when scrolling up
- Same pause / resume behavior as auto-scroll intercept`,
  },
  {
    title: "Loom inline preview + popup overlay",
    phase: "Video UX",
    blueprint: `Goals:
- Keep live Loom embed visible in chat bubble
- Transparent overlay captures clicks → opens fullscreen modal
- Viewing always happens in popup; thread shows preview only`,
  },
  {
    title: "Mobile responsiveness & input",
    phase: "Responsive polish",
    blueprint: `Goals:
- Responsive Tailwind scaling for mobile (fonts, bubbles, padding)
- Proportional header/footer on phones
- Responsive Loom modal with safe-area padding
- Single-line composer: nowrap + horizontal mask (iMessage style)
- Maintain #000 / #0B0B0C dark aesthetic`,
  },
  {
    title: "Composer & mobile video fixes",
    phase: "Bug fixes",
    blueprint: `Goals:
- Fix invisible scroll-linked typing text in footer input
- Fix collapsed Loom embed width on mobile (flex min-width issue)`,
  },
];

const entries = prompts.slice(0, 24).map((rawPrompt, index) => {
  const info = meta[index];
  return {
    id: `prompt-${String(index + 1).padStart(3, "0")}`,
    title: info.title,
    phase: info.phase,
    blueprint: info.blueprint,
    rawPrompt,
  };
});

const file = `export type PromptEntry = {
  id: string;
  title: string;
  phase: string;
  /** High-level blueprint summary for the middle pane. */
  blueprint: string;
  /** Exact conversational prompt text for the right pane. */
  rawPrompt: string;
};

export const promptEntries: PromptEntry[] = ${JSON.stringify(entries, null, 2)};
`;

fs.writeFileSync(path.join(root, "src/data/promptsData.ts"), file);
console.log("Wrote", entries.length, "prompt entries");
