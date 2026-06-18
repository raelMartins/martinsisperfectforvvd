/** Cinematic iMessage layout + scrollytelling track */
export const LAYOUT = {
  headerHeightClass:
    "h-[108px] sm:h-[128px] md:h-[148px] lg:h-[168px]",
  footerHeightClass:
    "h-[68px] sm:h-[80px] md:h-[92px] lg:h-[108px]",
  columnMaxWidth: 1800,
  /** Invisible scrub track — only the browser scrollbar moves. */
  scrubTrackHeight: "2000vh",
} as const;
