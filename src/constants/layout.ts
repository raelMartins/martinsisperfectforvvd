/** Cinematic iMessage layout + scrollytelling track */
export const LAYOUT = {
  headerHeightClass:
    "h-[108px] sm:h-[128px] md:h-[148px] lg:h-[168px]",
  footerHeightClass:
    "h-[68px] sm:h-[80px] md:h-[92px] lg:h-[108px]",
  columnMaxWidth: 1800,
  /**
   * Invisible scrub track — only the browser scrollbar moves. Typing is
   * scrubbed by scroll position, so track length sets typing speed: because
   * the track is vh-based it grows with window height, making desktop slower
   * than mobile. The halved desktop track spends half the scroll distance per
   * character, which speeds up both auto-play and manual wheel scrolling.
   */
  scrubTrackClass: "h-[2000vh] sm:h-[1000vh]",
} as const;
