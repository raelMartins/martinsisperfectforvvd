"use client";

import type { ImageAttachment } from "@/types/message";
import { useTheme } from "@/context/ThemeContext";

type ImageAttachmentBubbleProps = {
  image: ImageAttachment;
};

export default function ImageAttachmentBubble({
  image,
}: ImageAttachmentBubbleProps) {
  const { colors } = useTheme();
  const isMulti = image.images.length > 1;

  return (
    <div className="w-full min-w-[220px] max-w-[280px]">
      <div
        className={[
          "overflow-hidden rounded-[18px]",
          isMulti ? "grid grid-cols-2 gap-0.5" : "",
        ].join(" ")}
      >
        {image.images.map((item, index) => (
          <div
            key={item.src}
            className={[
              "relative overflow-hidden bg-[#1c1c1e]",
              isMulti ? "aspect-square" : "aspect-[4/5]",
              isMulti && index === 0 ? "rounded-tl-[18px]" : "",
              isMulti && index === 1 ? "rounded-tr-[18px]" : "",
              !isMulti ? "rounded-[18px]" : "",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {image.caption ? (
        <p
          className="mt-1.5 max-w-[280px] px-1 text-[12px] leading-snug"
          style={{ color: colors.muted }}
        >
          {image.caption}
        </p>
      ) : null}
    </div>
  );
}
