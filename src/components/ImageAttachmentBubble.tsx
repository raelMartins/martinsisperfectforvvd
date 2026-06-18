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
    <div className="w-full min-w-0 max-w-[min(100%,260px)] sm:max-w-[340px] md:max-w-[420px] lg:min-w-[300px] lg:max-w-[520px]">
      <div
        className={[
          "overflow-hidden rounded-[16px] sm:rounded-[20px] lg:rounded-[24px]",
          isMulti ? "grid grid-cols-2 gap-0.5 sm:gap-1" : "",
        ].join(" ")}
      >
        {image.images.map((item, index) => (
          <div
            key={item.src}
            className={[
              "relative overflow-hidden bg-[#0B0B0C]",
              isMulti ? "aspect-square" : "aspect-[4/5]",
              isMulti && index === 0 ? "rounded-tl-[16px] sm:rounded-tl-[20px] lg:rounded-tl-[24px]" : "",
              isMulti && index === 1 ? "rounded-tr-[16px] sm:rounded-tr-[20px] lg:rounded-tr-[24px]" : "",
              !isMulti ? "rounded-[16px] sm:rounded-[20px] lg:rounded-[24px]" : "",
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
          className="mt-2 max-w-full px-1 text-xs leading-snug sm:mt-2.5 sm:px-2 sm:text-sm md:text-base lg:mt-3 lg:text-xl"
          style={{ color: colors.muted }}
        >
          {image.caption}
        </p>
      ) : null}
    </div>
  );
}
