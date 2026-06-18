"use client";

import dynamic from "next/dynamic";

const BackgroundScene = dynamic(
  () => import("@/components/background/BackgroundScene"),
  { ssr: false },
);

export default function BackgroundCanvas() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <BackgroundScene />
    </div>
  );
}
