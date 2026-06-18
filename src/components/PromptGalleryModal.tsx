"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { promptEntries } from "@/data/promptsData";
import { downloadPromptPdf, downloadPromptTxt } from "@/lib/promptExport";
import { useModal } from "@/context/ModalContext";

function TrafficLights() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
    </div>
  );
}

export default function PromptGalleryModal() {
  const { isPromptGalleryOpen, closePromptGallery } = useModal();
  const [activeId, setActiveId] = useState(promptEntries[0]?.id ?? "");

  const activeIndex = Math.max(
    0,
    promptEntries.findIndex((entry) => entry.id === activeId),
  );
  const activePrompt = promptEntries[activeIndex] ?? promptEntries[0];

  useEffect(() => {
    if (!isPromptGalleryOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePromptGallery();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPromptGalleryOpen, closePromptGallery]);

  return (
    <AnimatePresence>
      {isPromptGalleryOpen ? (
        <motion.div
          key="prompt-gallery"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] sm:bg-transparent sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close prompt gallery"
            className="absolute inset-0 hidden bg-black/70 backdrop-blur-sm sm:block"
            onClick={closePromptGallery}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Cursor prompt history"
            className="relative z-10 flex h-[min(92dvh,760px)] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-[#3c3c3c] bg-[#0B0B0C] shadow-[0_40px_100px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#333] bg-[#1e1e1e] px-4 py-3">
              <div className="flex items-center gap-4">
                <TrafficLights />
                <div>
                  <p className="text-[13px] font-medium text-[#cccccc]">
                    Cursor — Prompt History
                  </p>
                  <p className="text-[11px] text-[#858585]">
                    martinsisperfectforvvd
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePromptGallery}
                className="flex h-10 w-10 items-center justify-center rounded-md text-[#858585] transition-colors hover:bg-[#3c3c3c] hover:text-[#cccccc]"
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            <div className="flex min-h-0 flex-1">
              {/* Column 1 — Explorer */}
              <aside className="hidden w-60 shrink-0 flex-col border-r border-[#333] bg-[#1e1e1e] md:flex">
                <div className="border-b border-[#333] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                  Explorer
                </div>
                <ul className="flex-1 overflow-y-auto p-2">
                  {promptEntries.map((entry, index) => {
                    const isActive = entry.id === activeId;
                    const label = `${String(index + 1).padStart(2, "0")} ${entry.title}`;

                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => setActiveId(entry.id)}
                          className={[
                            "mb-0.5 flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2 text-left text-[12px] transition-colors",
                            isActive
                              ? "bg-[#094771] text-[#ffffff]"
                              : "text-[#cccccc] hover:bg-[#2a2d2e]",
                          ].join(" ")}
                        >
                          <span className="block w-full font-medium leading-snug">
                            {label}
                          </span>
                          <span
                            className={[
                              "block w-full text-[10px] leading-snug",
                              isActive ? "text-[#9cdcfe]" : "text-[#858585]",
                            ].join(" ")}
                          >
                            {entry.phase}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Columns 2 & 3 */}
              <div className="flex min-w-0 flex-1 flex-col bg-[#0B0B0C]">
                <div className="shrink-0 border-b border-[#333] bg-[#1e1e1e] px-3 py-2 md:hidden">
                  <select
                    value={activeId}
                    onChange={(event) => setActiveId(event.target.value)}
                    className="w-full rounded-md border border-[#3c3c3c] bg-[#252526] px-2 py-2 text-[12px] text-[#cccccc]"
                  >
                    {promptEntries.map((entry, index) => (
                      <option key={entry.id} value={entry.id}>
                        {String(index + 1).padStart(2, "0")} {entry.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                  {/* Column 2 — Blueprint Summary */}
                  <div className="flex min-h-0 flex-col border-b border-[#333] lg:border-r lg:border-b-0">
                    <div className="flex shrink-0 items-center gap-2 border-b border-[#333] bg-[#1e1e1e] px-4 py-2">
                      <span className="rounded bg-[#264f78] px-2 py-0.5 text-[11px] text-[#9cdcfe]">
                        blueprint.md
                      </span>
                      <span className="truncate text-[11px] text-[#858585]">
                        {activePrompt?.title}
                      </span>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-[#d4d4d4]">
                        <span className="text-[#6a9955]">
                          {"// Agent blueprint summary\n\n"}
                        </span>
                        {activePrompt?.blueprint}
                      </pre>
                    </div>
                  </div>

                  {/* Column 3 — Raw Prompt */}
                  <div className="flex min-h-0 flex-col bg-[#141414]">
                    <div className="flex shrink-0 items-center gap-2 border-b border-[#333] bg-[#1e1e1e] px-4 py-2">
                      <span className="rounded bg-[#3c3c3c] px-2 py-0.5 text-[11px] text-[#d7ba7d]">
                        raw-prompt.txt
                      </span>
                      <span className="truncate text-[11px] text-[#858585]">
                        Exact wording
                      </span>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      <div className="h-full overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#1e1e1e]">
                        <div className="border-b border-[#333] bg-[#252526] px-3 py-1.5 text-[10px] text-[#858585]">
                          user query · verbatim
                        </div>
                        <pre className="max-h-full overflow-y-auto whitespace-pre-wrap p-4 font-mono text-[11px] leading-relaxed text-[#ce9178] sm:text-[12px]">
                          {activePrompt?.rawPrompt}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#333] bg-[#1e1e1e] px-4 py-3">
              <p className="text-[11px] text-[#858585]">
                {promptEntries.length} prompts · export ready
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    activePrompt && downloadPromptTxt(activePrompt, activeIndex)
                  }
                  className="rounded-md border border-[#3c3c3c] px-3 py-2 text-[12px] text-[#cccccc] transition-colors hover:bg-[#2a2d2e]"
                >
                  Download .txt
                </button>
                <button
                  type="button"
                  onClick={() =>
                    activePrompt &&
                    void downloadPromptPdf(activePrompt, activeIndex)
                  }
                  className="rounded-md bg-[#0e639c] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#1177bb]"
                >
                  Download PDF
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
