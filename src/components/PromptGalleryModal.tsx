"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { getAllPromptsAsText, promptEntries } from "@/data/promptsData";
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

function downloadPromptsPdf() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addLine = (text: string, fontSize = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];

    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += fontSize * 1.45;
    }
  };

  addLine("Cursor Prompt History", 18, true);
  addLine("martinsisperfectforvvd — build transcript", 10);
  y += 8;

  promptEntries.forEach((entry, index) => {
    addLine(`${index + 1}. ${entry.title}`, 13, true);
    addLine(`Phase: ${entry.phase}`, 10);
    y += 4;
    addLine(entry.content, 11);
    y += 12;
  });

  doc.save("cursor-prompt-history.pdf");
}

function downloadPromptsTxt() {
  const blob = new Blob([getAllPromptsAsText()], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cursor-prompt-history.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PromptGalleryModal() {
  const { isPromptGalleryOpen, closePromptGallery } = useModal();
  const [activeId, setActiveId] = useState(promptEntries[0]?.id ?? "");

  const activePrompt =
    promptEntries.find((entry) => entry.id === activeId) ?? promptEntries[0];

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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close prompt gallery"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closePromptGallery}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Cursor prompt history"
            className="relative z-10 flex h-[min(88vh,720px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#3c3c3c] bg-[#1e1e1e] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#333] bg-[#252526] px-4 py-3">
              <div className="flex items-center gap-4">
                <TrafficLights />
                <div className="hidden sm:block">
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
                className="rounded-md px-2 py-1 text-[#858585] transition-colors hover:bg-[#3c3c3c] hover:text-[#cccccc]"
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            <div className="flex min-h-0 flex-1">
              <aside className="hidden w-56 shrink-0 flex-col border-r border-[#333] bg-[#252526] sm:flex">
                <div className="border-b border-[#333] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                  Explorer
                </div>
                <ul className="flex-1 overflow-y-auto p-2">
                  {promptEntries.map((entry, index) => {
                    const isActive = entry.id === activeId;

                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => setActiveId(entry.id)}
                          className={[
                            "mb-0.5 flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-[12px] transition-colors",
                            isActive
                              ? "bg-[#094771] text-[#ffffff]"
                              : "text-[#cccccc] hover:bg-[#2a2d2e]",
                          ].join(" ")}
                        >
                          <span className="mt-0.5 text-[#858585]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="block font-medium">{entry.title}</span>
                            <span
                              className={[
                                "text-[10px]",
                                isActive ? "text-[#9cdcfe]" : "text-[#858585]",
                              ].join(" ")}
                            >
                              {entry.phase}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center gap-2 border-b border-[#333] bg-[#1e1e1e] px-4 py-2">
                  <span className="rounded bg-[#264f78] px-2 py-0.5 text-[11px] text-[#9cdcfe]">
                    prompt.md
                  </span>
                  <span className="truncate text-[11px] text-[#858585]">
                    {activePrompt?.title}
                  </span>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                  <div className="overflow-y-auto border-b border-[#333] p-4 lg:border-b-0 lg:border-r">
                    <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-[#d4d4d4]">
                      <span className="text-[#6a9955]">
                        {"// Cursor agent prompt\n"}
                      </span>
                      {activePrompt?.content}
                    </pre>
                  </div>

                  <div className="flex flex-col bg-[#181818] p-4">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                      Screenshot preview
                    </p>
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-[#3c3c3c] bg-[#1e1e1e] p-6">
                      {activePrompt?.screenshotSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activePrompt.screenshotSrc}
                          alt={`Screenshot for ${activePrompt.title}`}
                          className="max-h-full max-w-full rounded-md object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#252526] text-[#858585]">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              aria-hidden
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                          <p className="text-[13px] font-medium text-[#cccccc]">
                            Screenshot slot
                          </p>
                          <p className="mt-1 text-[11px] text-[#858585]">
                            Drop prompt screenshots here later
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#333] bg-[#252526] px-4 py-3">
              <p className="text-[11px] text-[#858585]">
                {promptEntries.length} prompts · export ready
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadPromptsTxt}
                  className="rounded-md border border-[#3c3c3c] px-3 py-1.5 text-[12px] text-[#cccccc] transition-colors hover:bg-[#2a2d2e]"
                >
                  Download .txt
                </button>
                <button
                  type="button"
                  onClick={downloadPromptsPdf}
                  className="rounded-md bg-[#0e639c] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#1177bb]"
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
