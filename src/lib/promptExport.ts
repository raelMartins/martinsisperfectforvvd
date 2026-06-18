import type { PromptEntry } from "@/data/promptsData";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPromptExport(entry: PromptEntry, index: number) {
  const number = String(index + 1).padStart(2, "0");

  return [
    `Cursor Prompt History — martinsisperfectforvvd`,
    `${number} ${entry.title} (${entry.phase})`,
    "=".repeat(72),
    "",
    "AGENT BLUEPRINT SUMMARY",
    "-".repeat(72),
    entry.blueprint.trim(),
    "",
    "RAW PROMPT",
    "-".repeat(72),
    entry.rawPrompt.trim(),
    "",
  ].join("\n");
}

export function downloadPromptTxt(entry: PromptEntry, index: number) {
  const blob = new Blob([formatPromptExport(entry, index)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${String(index + 1).padStart(2, "0")}-${slugify(entry.title)}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadPromptPdf(entry: PromptEntry, index: number) {
  // Dynamic import keeps jspdf out of the initial modal bundle until export.
  return import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const addLines = (
      text: string,
      fontSize = 11,
      style: "normal" | "bold" = "normal",
    ) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth) as string[];

      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += fontSize * 1.45;
      }
    };

    const number = String(index + 1).padStart(2, "0");
    addLines("Cursor Prompt History", 18, "bold");
    addLines("martinsisperfectforvvd", 10);
    y += 6;
    addLines(`${number} — ${entry.title}`, 14, "bold");
    addLines(`Phase: ${entry.phase}`, 10);
    y += 8;
    addLines("Agent Blueprint Summary", 12, "bold");
    y += 4;
    addLines(entry.blueprint.trim(), 11);
    y += 10;
    addLines("Raw Prompt", 12, "bold");
    y += 4;
    addLines(entry.rawPrompt.trim(), 10);

    doc.save(`${String(index + 1).padStart(2, "0")}-${slugify(entry.title)}.pdf`);
  });
}
