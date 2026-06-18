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
    <div className="w-full min-w-[300px] max-w-[520px] sm:min-w-[360px]">
      <div
        className={[
          "overflow-hidden rounded-[24px]",
          isMulti ? "grid grid-cols-2 gap-1" : "",
        ].join(" ")}
      >
        {image.images.map((item, index) => (
          <div
            key={item.src}
            className={[
              "relative overflow-hidden bg-[#1c1c1e]",
              isMulti ? "aspect-square" : "aspect-[4/5]",
              isMulti && index === 0 ? "rounded-tl-[24px]" : "",
              isMulti && index === 1 ? "rounded-tr-[24px]" : "",
              !isMulti ? "rounded-[24px]" : "",
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
          className="mt-3 max-w-[520px] px-2 text-lg leading-snug sm:text-xl"
          style={{ color: colors.muted }}
        >
          {image.caption}
        </p>
      ) : null}
    </div>
  );
}
