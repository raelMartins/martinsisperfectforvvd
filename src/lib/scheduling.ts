const SCHEDULING_URL = process.env.NEXT_PUBLIC_SCHEDULING_URL?.trim() ?? "";

export type SchedulingLayout = "column_view" | "month_view";

export function getSchedulingUrl() {
  return SCHEDULING_URL;
}

export function getSchedulingEmbedSrc(
  layout: SchedulingLayout,
  theme: "dark" | "light",
) {
  if (!SCHEDULING_URL) return null;

  try {
    const url = new URL(SCHEDULING_URL);
    url.searchParams.set("embed", "true");
    url.searchParams.set("layout", layout);
    url.searchParams.set("theme", theme);
    return url.toString();
  } catch {
    return null;
  }
}
